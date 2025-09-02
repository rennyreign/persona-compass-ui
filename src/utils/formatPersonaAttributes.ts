/**
 * Utility functions to format persona attributes from underscore format to human-readable format
 */

export const formatPersonaAttribute = (attribute: string): string => {
  // Handle common persona attribute patterns
  const attributeMap: Record<string, string> = {
    // Core Values
    'employee_experience': 'Employee Experience',
    'organizational_development': 'Organizational Development',
    'compliance': 'Compliance',
    'efficiency': 'Efficiency',
    'continuous_improvement': 'Continuous Improvement',
    'data_driven_decisions': 'Data-Driven Decisions',
    'savings': 'Cost Savings',
    'partnership': 'Partnership',
    'value': 'Value Creation',
    'optimization': 'Process Optimization',
    'innovation': 'Innovation',
    'streamlined': 'Streamlined Operations',

    // Personality Traits
    'people_focused': 'People-Focused',
    'strategic': 'Strategic Thinking',
    'compliance_oriented': 'Compliance-Oriented',
    'analytical': 'Analytical',
    'results_oriented': 'Results-Oriented',
    'strategic_thinking': 'Strategic Thinking',
    'detail_oriented': 'Detail-Oriented',
    'cost_conscious': 'Cost-Conscious',
    'relationship_focused': 'Relationship-Focused',
    'solution_oriented': 'Solution-Oriented',
    'tech_savvy': 'Tech-Savvy',
    'collaborative': 'Collaborative',

    // Goals
    'advance_to_hr_manager': 'Advance to HR Manager',
    'specialize_in_strategic_hr': 'Specialize in Strategic HR',
    'advance_to_director_level': 'Advance to Director Level',
    'master_supply_chain_analytics': 'Master Supply Chain Analytics',
    'become_procurement_manager': 'Become Procurement Manager',
    'master_strategic_sourcing': 'Master Strategic Sourcing',
    'advance_to_logistics_manager': 'Advance to Logistics Manager',
    'master_transportation_optimization': 'Master Transportation Optimization',

    // Pain Points
    'limited_strategic_involvement': 'Limited Strategic Involvement',
    'need_for_advanced_skills': 'Need for Advanced Skills',
    'supply_chain_disruptions': 'Supply Chain Disruptions',
    'lack_of_strategic_training': 'Lack of Strategic Training',
    'vendor_relationship_management': 'Vendor Relationship Management',
    'cost_reduction_pressure': 'Cost Reduction Pressure',
    'delivery_delays': 'Delivery Delays',
    'inventory_management_challenges': 'Inventory Management Challenges',

    // Channels
    'SHRM_resources': 'SHRM Resources',
    'LinkedIn': 'LinkedIn',
    'industry_publications': 'Industry Publications',
    'professional_associations': 'Professional Associations',
    'logistics_publications': 'Logistics Publications',
  };

  // Return mapped value if exists, otherwise format the underscore string
  if (attributeMap[attribute]) {
    return attributeMap[attribute];
  }

  // Fallback: Convert underscore to title case
  return attribute
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatPersonaAttributes = (attributes: string[]): string[] => {
  return attributes.map(formatPersonaAttribute);
};

export const formatPersonaAttributesList = (attributes: string[] | undefined): string[] => {
  if (!attributes || !Array.isArray(attributes)) {
    return [];
  }
  return formatPersonaAttributes(attributes);
};
