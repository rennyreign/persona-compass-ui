# Program Management System - Usage Guide

## Overview

The Program Management System provides a comprehensive solution for importing, managing, and utilizing university program data for AI-powered persona generation. This guide covers all features and functionality.

## Key Features

### 1. Program Data Import Automation
- **Multiple Data Sources**: Support for API, web scraping, and manual data sources
- **Data Validation**: Automatic validation and standardization of program information
- **Progress Tracking**: Real-time import progress with detailed error reporting
- **Duplicate Prevention**: Automatic detection and skipping of existing programs

### 2. Program Management Interface
- **CRUD Operations**: Create, read, update, and delete programs
- **Search & Filter**: Find programs by name, category, or other criteria
- **Categorization**: Organized program categories for better management
- **Bulk Operations**: Import multiple programs simultaneously

### 3. AI Persona Generation Integration
- **Dynamic Data**: AI personas generated using live program data from database
- **Context-Aware**: Program-specific targeting and messaging
- **User Association**: Generated personas linked to authenticated users
- **Quality Control**: Validation and enrichment of generated personas

## Getting Started

### Accessing Program Management

1. **Navigate to Admin Panel**: Go to the admin section of the application
2. **Select Organization**: Choose your university/organization from the dropdown
3. **Program Management Section**: Located in the main admin dashboard

### Importing Program Data

1. **Click "Import Program Data"** button in the Program Management header
2. **Select Data Sources**: Choose from available sources:
   - **Michigan State University (Manual)**: Pre-configured MSU programs
   - **College Scorecard API**: Federal education data
   - **Custom Sources**: Add your own data sources
3. **Start Import**: Click "Import Programs" to begin the process
4. **Monitor Progress**: Watch real-time progress and error reporting
5. **Review Results**: Check import statistics and handle any errors

### Managing Programs

1. **Add New Program**: Click "Add Program" in the header
2. **Fill Program Details**:
   - **Name**: Program title
   - **Category**: Select from predefined categories
   - **Description**: Detailed program overview
   - **Target Audience**: Primary audience description
   - **Key Benefits**: List of program benefits
3. **Save Program**: Submit the form to save to database

### Generating AI Personas

1. **Navigate to Persona Management**: In the admin panel
2. **Click "Generate AI Personas"**: For any program
3. **Configure Generation**:
   - **Select Programs**: Choose target programs
   - **Set Parameters**: Number of personas, intelligence level
   - **Add Prompt**: Custom generation instructions
4. **Generate**: AI creates personas using program data
5. **Review Results**: Generated personas saved to database

## Data Sources

### Available Sources

#### Michigan State University (Manual)
- **Type**: Pre-configured program data
- **Programs**: 4 comprehensive programs
- **Categories**: Supply Chain, Management, HR, Marketing
- **Status**: Ready to use

#### College Scorecard API
- **Type**: Federal education data API
- **Coverage**: All US higher education institutions
- **Data**: Program information, outcomes, costs
- **Status**: Framework implemented

### Adding Custom Sources

```typescript
const customSource: ProgramDataSource = {
  id: 'custom-university',
  name: 'Custom University',
  type: 'api', // or 'scraper' or 'manual'
  baseUrl: 'https://api.university.edu/programs',
  apiKey: 'your-api-key',
  headers: {
    'Authorization': 'Bearer token'
  },
  rateLimit: 100 // requests per minute
};
```

## Program Categories

### Standard Categories
- **Supply Chain Management**: Logistics, operations, procurement
- **Management and Leadership**: Executive programs, MBA, leadership
- **Human Capital Management**: HR, talent development, organizational psychology
- **Marketing and Analytics**: Marketing research, data analytics, consumer behavior
- **Technology Management**: IT, data science, digital transformation
- **Healthcare Management**: Healthcare administration, policy, operations
- **Finance and Accounting**: Financial management, accounting, economics
- **Professional Development**: General skills, certifications, continuing education

## API Integration

### Database Schema

```sql
-- Programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  key_benefits TEXT[],
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Service Integration

```typescript
// Fetch programs for organization
const programs = await RAGDataService.getAllPrograms(organizationId);

// Generate personas with program data
const personas = await AIPersonaGenerator.generatePersonas({
  universityId: organizationId,
  programs: selectedPrograms,
  prompt: customPrompt,
  count: 5,
  intelligenceLevel: 'advanced'
});
```

## Best Practices

### Data Quality
1. **Validate Sources**: Ensure data sources provide accurate, up-to-date information
2. **Regular Updates**: Refresh program data periodically
3. **Quality Control**: Review imported programs for accuracy
4. **Categorization**: Use consistent category naming

### Performance
1. **Batch Operations**: Import programs in batches for large datasets
2. **Rate Limiting**: Respect API rate limits to avoid blocking
3. **Caching**: Cache frequently accessed program data
4. **Indexing**: Ensure database indexes for search performance

### Security
1. **API Keys**: Store API keys securely in environment variables
2. **Access Control**: Use Row Level Security (RLS) for data isolation
3. **Validation**: Validate all input data before database insertion
4. **Audit Trail**: Log all program management operations

## Troubleshooting

### Common Issues

#### Import Failures
- **Check API Keys**: Ensure valid authentication credentials
- **Network Issues**: Verify connectivity to data sources
- **Rate Limits**: Reduce request frequency if hitting limits
- **Data Format**: Validate source data format compatibility

#### Generation Issues
- **OpenAI API**: Verify API key and quota availability
- **Program Data**: Ensure programs exist in database
- **Authentication**: Check user authentication status
- **Database**: Verify database connectivity and permissions

#### UI Issues
- **Browser Cache**: Clear browser cache and reload
- **JavaScript Errors**: Check browser console for errors
- **Network**: Verify API endpoints are accessible
- **Authentication**: Ensure user is properly logged in

### Error Codes

- **PROG_001**: Invalid program data format
- **PROG_002**: Duplicate program detected
- **PROG_003**: API authentication failed
- **PROG_004**: Rate limit exceeded
- **PROG_005**: Database connection error

## Support

### Documentation
- **API Reference**: `/docs/api`
- **Database Schema**: `/docs/schema`
- **Component Library**: `/docs/components`

### Contact
- **Technical Issues**: Submit GitHub issue
- **Feature Requests**: Create feature request ticket
- **General Support**: Contact admin team

## Changelog

### Version 2.0.0 (Current)
- ✅ Program data automation service
- ✅ Multi-source import capability
- ✅ Enhanced AI persona generation
- ✅ Improved admin interface
- ✅ Database integration with RLS

### Version 1.0.0
- ✅ Basic program management
- ✅ Manual program creation
- ✅ Simple persona generation
- ✅ Admin interface foundation
