"""
Vector Memory Store for ORDAE System using Pinecone
Replaces JSON storage with semantic vector embeddings
"""
import os
import json
import hashlib
from typing import Dict, Any, List, Optional
from datetime import datetime
from pathlib import Path
from pinecone import Pinecone, ServerlessSpec
import openai

class VectorMemoryStore:
    def __init__(self):
        self.pc: Optional[Pinecone] = None
        self.index = None
        self.openai_client: Optional[openai.OpenAI] = None
        self.index_name = "ordae-memory"
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize Pinecone and OpenAI clients"""
        # Load environment variables
        env_file = Path(__file__).parent.parent.parent / ".env"
        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    if line.strip() and not line.startswith('#'):
                        key, value = line.strip().split('=', 1)
                        os.environ[key] = value.strip('"\'')
        
        # Initialize Pinecone
        pinecone_key = os.getenv('PINECONE_API_KEY')
        if pinecone_key:
            self.pc = Pinecone(api_key=pinecone_key)
            self._setup_index()
            print("✅ Pinecone vector store initialized")
        
        # Initialize OpenAI for embeddings
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            self.openai_client = openai.OpenAI(api_key=openai_key)
            print("✅ OpenAI embeddings client initialized")
    
    def _setup_index(self):
        """Create or connect to Pinecone index"""
        try:
            # Check if index exists
            if self.index_name not in self.pc.list_indexes().names():
                # Create index with 1536 dimensions (OpenAI ada-002 embedding size)
                self.pc.create_index(
                    name=self.index_name,
                    dimension=1536,
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                )
                print(f"✅ Created Pinecone index: {self.index_name}")
            
            # Connect to index
            self.index = self.pc.Index(self.index_name)
            print(f"✅ Connected to Pinecone index: {self.index_name}")
            
        except Exception as e:
            print(f"❌ Error setting up Pinecone index: {e}")
    
    def _create_embedding(self, text: str) -> List[float]:
        """Create embedding vector from text using OpenAI"""
        if not self.openai_client:
            return [0.0] * 1536  # Return zero vector as fallback
        
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"❌ Error creating embedding: {e}")
            return [0.0] * 1536
    
    def store_memory(self, state: Dict[str, Any]) -> bool:
        """Store ORDAE state as vector embedding"""
        if not self.index or not self.openai_client:
            return self._fallback_local_storage(state)
        
        try:
            # Create text representation of state for embedding
            state_text = self._state_to_text(state)
            
            # Generate embedding
            embedding = self._create_embedding(state_text)
            
            # Create unique ID based on iteration and timestamp
            memory_id = f"ordae-{state.get('iteration', 1)}-{int(datetime.now().timestamp())}"
            
            # Prepare metadata
            metadata = {
                'timestamp': datetime.now().isoformat(),
                'iteration': state.get('iteration', 1),
                'system_id': 'ordae-main',
                'state_summary': state_text[:500],  # Store truncated text for reference
                'snapshot_keys': list(state.get('snapshot', {}).keys()),
                'decision_type': state.get('decision', {}).get('type', 'unknown'),
                'actions_count': len(state.get('actions', {})),
                'evaluation_score': state.get('evaluation', {}).get('score', 0)
            }
            
            # Store in Pinecone
            self.index.upsert(
                vectors=[(memory_id, embedding, metadata)]
            )
            
            print(f"✅ Memory stored as vector: iteration {state.get('iteration', 1)}")
            return True
            
        except Exception as e:
            print(f"❌ Error storing vector memory: {e}")
            return self._fallback_local_storage(state)
    
    def retrieve_similar_memories(self, query_state: Dict[str, Any], limit: int = 5) -> List[Dict[str, Any]]:
        """Retrieve semantically similar memories using vector search"""
        if not self.index or not self.openai_client:
            return self._fallback_local_retrieval(limit)
        
        try:
            # Create query embedding
            query_text = self._state_to_text(query_state)
            query_embedding = self._create_embedding(query_text)
            
            # Search for similar vectors
            results = self.index.query(
                vector=query_embedding,
                top_k=limit,
                include_metadata=True
            )
            
            memories = []
            for match in results.matches:
                memory = {
                    'id': match.id,
                    'similarity_score': match.score,
                    'timestamp': match.metadata.get('timestamp'),
                    'iteration': match.metadata.get('iteration'),
                    'state_summary': match.metadata.get('state_summary'),
                    'decision_type': match.metadata.get('decision_type'),
                    'actions_count': match.metadata.get('actions_count'),
                    'evaluation_score': match.metadata.get('evaluation_score')
                }
                memories.append(memory)
            
            print(f"✅ Retrieved {len(memories)} similar memories")
            return memories
            
        except Exception as e:
            print(f"❌ Error retrieving vector memories: {e}")
            return self._fallback_local_retrieval(limit)
    
    def retrieve_recent_memories(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Retrieve most recent memories by iteration number"""
        if not self.index:
            return self._fallback_local_retrieval(limit)
        
        try:
            # Query with high iteration filter to get recent memories
            results = self.index.query(
                vector=[0.0] * 1536,  # Dummy vector for metadata-only search
                top_k=limit,
                include_metadata=True,
                filter={'system_id': 'ordae-main'}
            )
            
            # Sort by iteration descending
            memories = []
            for match in results.matches:
                memory = {
                    'id': match.id,
                    'timestamp': match.metadata.get('timestamp'),
                    'iteration': match.metadata.get('iteration'),
                    'state_summary': match.metadata.get('state_summary'),
                    'decision_type': match.metadata.get('decision_type'),
                    'actions_count': match.metadata.get('actions_count'),
                    'evaluation_score': match.metadata.get('evaluation_score')
                }
                memories.append(memory)
            
            # Sort by iteration number
            memories.sort(key=lambda x: x.get('iteration', 0), reverse=True)
            return memories[:limit]
            
        except Exception as e:
            print(f"❌ Error retrieving recent memories: {e}")
            return self._fallback_local_retrieval(limit)
    
    def _state_to_text(self, state: Dict[str, Any]) -> str:
        """Convert ORDAE state to text for embedding"""
        parts = []
        
        # Add iteration context
        parts.append(f"ORDAE Iteration {state.get('iteration', 1)}")
        
        # Add snapshot summary
        snapshot = state.get('snapshot', {})
        if snapshot:
            parts.append(f"Observations: {json.dumps(snapshot, indent=None)[:200]}...")
        
        # Add decision summary
        decision = state.get('decision', {})
        if decision:
            parts.append(f"Decision: {json.dumps(decision, indent=None)[:200]}...")
        
        # Add actions summary
        actions = state.get('actions', {})
        if actions:
            parts.append(f"Actions: {json.dumps(actions, indent=None)[:200]}...")
        
        # Add evaluation summary
        evaluation = state.get('evaluation', {})
        if evaluation:
            parts.append(f"Evaluation: {json.dumps(evaluation, indent=None)[:200]}...")
        
        return " | ".join(parts)
    
    def _fallback_local_storage(self, state: Dict[str, Any]) -> bool:
        """Fallback to local JSON storage"""
        try:
            from ..nodes.remember import remember
            remember(state)
            return True
        except:
            return False
    
    def _fallback_local_retrieval(self, limit: int) -> List[Dict[str, Any]]:
        """Fallback to local JSON retrieval"""
        ledger_path = Path.cwd() / "orchestrator" / "memory" / "ledger.json"
        if not ledger_path.exists():
            return []
        
        try:
            with open(ledger_path, 'r') as f:
                ledger = json.load(f)
            return ledger[-limit:] if ledger else []
        except:
            return []

# Global instance
vector_memory_store = VectorMemoryStore()
