import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'contentMarkdown': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'wordBreak': 'break-word',
    'color': '#000',
    'fontFamily': 'Arial, sans-serif',
    'lineHeight': [{ 'unit': 'px', 'value': 1.6 }]
  },
  'contentMarkdown h1': {
    'fontSize': [{ 'unit': 'px', 'value': 32 }],
    'fontWeight': '700',
    'margin': [{ 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown h2': {
    'fontSize': [{ 'unit': 'px', 'value': 28 }],
    'fontWeight': '700',
    'margin': [{ 'unit': 'px', 'value': 22 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown h3': {
    'fontSize': [{ 'unit': 'px', 'value': 24 }],
    'fontWeight': '700',
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 12 }, { 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown h4': {
    'fontSize': [{ 'unit': 'px', 'value': 20 }],
    'fontWeight': '700',
    'margin': [{ 'unit': 'px', 'value': 18 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown h5': {
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'fontWeight': '500',
    'margin': [{ 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 8 }, { 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown h6': {
    'fontSize': [{ 'unit': 'px', 'value': 14 }],
    'fontWeight': '500',
    'margin': [{ 'unit': 'px', 'value': 14 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 6 }, { 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown ol': {
    'paddingLeft': [{ 'unit': 'px', 'value': 40 }],
    'listStyle': 'decimal'
  },
  'contentMarkdown ol li': {
    'marginBottom': [{ 'unit': 'px', 'value': 8 }],
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.5 }]
  },
  'contentMarkdown ol li p': {
    'marginBottom': [{ 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown ul': {
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 40 }],
    'listStyle': 'disc'
  },
  'contentMarkdown ul li': {
    'marginBottom': [{ 'unit': 'px', 'value': 8 }],
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'lineHeight': [{ 'unit': 'px', 'value': 1.5 }]
  },
  'contentMarkdown ul li p': {
    'marginBottom': [{ 'unit': 'px', 'value': 0 }]
  },
  'contentMarkdown ul li ul': {
    'margin': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 20 }]
  },
  'contentMarkdown hr': {
    'height': [{ 'unit': 'px', 'value': 1 }],
    'margin': [{ 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 24 }, { 'unit': 'px', 'value': 0 }],
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'backgroundColor': '#ccc'
  },
  'contentMarkdown blockquote': {
    'margin': [{ 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 16 }, { 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 15 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 15 }],
    'borderLeft': [{ 'unit': 'px', 'value': 4 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#888' }],
    'backgroundColor': '#f9f9f9'
  },
  'contentMarkdown blockquote p': {
    'marginBottom': [{ 'unit': 'px', 'value': 10 }]
  },
  'contentMarkdown blockquote p a': {
    'color': '#1c1c1e',
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'textDecoration': 'underline'
  },
  'contentMarkdown p:not(li p)': {
    'lineHeight': [{ 'unit': 'px', 'value': 25 }]
  },
  'contentMarkdown details': {
    'lineHeight': [{ 'unit': 'px', 'value': 25 }]
  },
  'contentMarkdown details': {
    'marginBottom': [{ 'unit': 'px', 'value': 5 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 15 }]
  },
  'contentMarkdown details summary': {
    'fontWeight': '600',
    'cursor': 'pointer'
  },
  'contentMarkdown pre': {
    'marginBottom': [{ 'unit': 'px', 'value': 20 }]
  },
  'contentMarkdown reference': {
    'marginBottom': [{ 'unit': 'px', 'value': 8 }],
    'fontWeight': '700',
    'textDecoration': 'underline',
    'cursor': 'pointer'
  },
  'contentMarkdown img': {
    'display': 'block',
    'maxWidth': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': 'string', 'value': 'auto' }, { 'unit': 'string', 'value': '!important' }]
  },
  'contentMarkdown em': {
    'fontWeight': '700'
  },
  'contentMarkdown table': {
    'borderCollapse': 'separate',
    'borderSpacing': '0',
    'textAlign': 'left',
    'lineHeight': [{ 'unit': 'px', 'value': 1.5 }],
    'borderTop': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#ccc' }],
    'borderLeft': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#ccc' }],
    'borderCollapse': 'collapse',
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'contentMarkdown table th': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'wordWrap': 'break-word',
    'border': [{ 'unit': 'string', 'value': 'none' }],
    'fontWeight': 'bold',
    'verticalAlign': 'top',
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#ddd' }]
  },
  'contentMarkdown table td': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'wordWrap': 'break-word',
    'verticalAlign': 'top',
    'borderRight': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#ccc' }],
    'borderBottom': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#ccc' }],
    'border': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#ddd' }],
    'textAlign': 'left'
  },
  'contentMarkdown table': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'tableLayout': 'fixed'
  },
  'contentMarkdown thead': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'tableLayout': 'fixed'
  },
  'contentMarkdown tbody': {
    'width': [{ 'unit': '%H', 'value': 1 }],
    'tableLayout': 'fixed'
  },
  'contentMarkdown linkBox': {
    'display': 'flex',
    'position': 'relative',
    'top': [{ 'unit': 'px', 'value': 4 }],
    'justifyContent': 'space-between',
    'marginBottom': [{ 'unit': 'px', 'value': 10 }],
    'padding': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }],
    'borderRadius': '10px',
    'backgroundColor': '#faf9f8',
    'color': 'inherit',
    'fontWeight': '700',
    'lineHeight': [{ 'unit': 'px', 'value': 20 }],
    'textDecoration': 'none',
    'cursor': 'pointer'
  },
  'contentMarkdown linkBox:hover': {
    'backgroundColor': '#eee'
  },
  'contentMarkdown sessionImgloading': {
    'width': [{ 'unit': 'px', 'value': 100 }]
  },
  'curriculumDescriptionMarkdown h1': {
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'fontSize': [{ 'unit': 'px', 'value': 20 }],
    'fontWeight': '700'
  },
  'curriculumDescriptionMarkdown h2': {
    'marginTop': [{ 'unit': 'px', 'value': 50 }],
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'fontSize': [{ 'unit': 'px', 'value': 18 }],
    'fontWeight': '700'
  },
  'curriculumDescriptionMarkdown h3': {
    'marginTop': [{ 'unit': 'px', 'value': 30 }],
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'fontWeight': '700'
  },
  'curriculumDescriptionMarkdown ol': {
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 35 }],
    'listStylePosition': 'inside'
  },
  'curriculumDescriptionMarkdown ol li': {
    'marginBottom': [{ 'unit': 'px', 'value': 10 }],
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'lineHeight': [{ 'unit': 'px', 'value': 25 }],
    'listStyle': 'decimal'
  },
  'curriculumDescriptionMarkdown ol li::marker': {
    'display': 'inline-block',
    'width': [{ 'unit': 'em', 'value': 2 }],
    'listStylePosition': 'inside',
    'textAlign': 'center'
  },
  'curriculumDescriptionMarkdown ol li p': {
    'marginBottom': [{ 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'curriculumDescriptionMarkdown ul': {
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 35 }]
  },
  'curriculumDescriptionMarkdown ul li': {
    'marginBottom': [{ 'unit': 'px', 'value': 10 }],
    'fontSize': [{ 'unit': 'px', 'value': 14 }],
    'lineHeight': [{ 'unit': 'px', 'value': 18 }],
    'listStyle': 'initial'
  },
  'curriculumDescriptionMarkdown ul li::marker': {
    'display': 'inline-block',
    'width': [{ 'unit': 'em', 'value': 2 }],
    'listStylePosition': 'inside',
    'textAlign': 'center'
  },
  'curriculumDescriptionMarkdown ul li p': {
    'marginBottom': [{ 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'curriculumDescriptionMarkdown ul li ul': {
    'margin': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 20 }]
  },
  'curriculumDescriptionMarkdown hr': {
    'height': [{ 'unit': 'px', 'value': 0.5 }],
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }],
    'backgroundColor': '#888'
  },
  'curriculumDescriptionMarkdown blockquote': {
    'margin': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }],
    'borderLeft': [{ 'unit': 'px', 'value': 3 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'currentcolor' }]
  },
  'curriculumDescriptionMarkdown blockquote p': {
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'curriculumDescriptionMarkdown blockquote p a': {
    'color': '#1c1c1e',
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'textDecoration': 'underline'
  },
  'curriculumDescriptionMarkdown p:not(li p)': {
    'lineHeight': [{ 'unit': 'px', 'value': 25 }]
  },
  'curriculumDescriptionMarkdown details': {
    'lineHeight': [{ 'unit': 'px', 'value': 25 }]
  },
  'curriculumDescriptionMarkdown details': {
    'marginBottom': [{ 'unit': 'px', 'value': 5 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 15 }]
  },
  'curriculumDescriptionMarkdown details summary': {
    'fontWeight': '600',
    'cursor': 'pointer'
  },
  'curriculumDescriptionMarkdown pre': {
    'marginBottom': [{ 'unit': 'px', 'value': 20 }]
  },
  'curriculumDescriptionMarkdown reference': {
    'marginBottom': [{ 'unit': 'px', 'value': 8 }],
    'fontWeight': '700',
    'textDecoration': 'underline',
    'cursor': 'pointer'
  },
  'curriculumDescriptionMarkdown img': {
    'display': 'block',
    'maxWidth': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': 'string', 'value': 'auto' }, { 'unit': 'string', 'value': '!important' }],
    'textAlign': 'center'
  },
  'curriculumDescriptionMarkdown em': {
    'fontWeight': '700'
  },
  'curriculumDescriptionMarkdown table': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'curriculumDescriptionMarkdown thead': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'curriculumDescriptionMarkdown tbody': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'curriculumDescriptionMarkdown linkBox': {
    'display': 'flex',
    'position': 'relative',
    'top': [{ 'unit': 'px', 'value': 4 }],
    'justifyContent': 'space-between',
    'marginBottom': [{ 'unit': 'px', 'value': 10 }],
    'padding': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }],
    'borderRadius': '10px',
    'backgroundColor': '#faf9f8',
    'color': 'inherit',
    'fontWeight': '700',
    'lineHeight': [{ 'unit': 'px', 'value': 20 }],
    'textDecoration': 'none',
    'cursor': 'pointer'
  },
  'curriculumDescriptionMarkdown linkBox:hover': {
    'backgroundColor': '#eee'
  },
  'curriculumDescriptionMarkdown sessionImgloading': {
    'width': [{ 'unit': 'px', 'value': 100 }]
  },
  'courseAccordionMarkdown': {
    'margin': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 48 }]
  },
  'courseAccordionMarkdown h1': {
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'fontSize': [{ 'unit': 'px', 'value': 20 }],
    'fontWeight': '700'
  },
  'courseAccordionMarkdown h2': {
    'marginTop': [{ 'unit': 'px', 'value': 50 }],
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'fontSize': [{ 'unit': 'px', 'value': 18 }],
    'fontWeight': '700'
  },
  'courseAccordionMarkdown h3': {
    'marginTop': [{ 'unit': 'px', 'value': 30 }],
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'fontWeight': '700'
  },
  'courseAccordionMarkdown ol': {
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 35 }],
    'listStylePosition': 'inside'
  },
  'courseAccordionMarkdown ol li': {
    'marginBottom': [{ 'unit': 'px', 'value': 10 }],
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'lineHeight': [{ 'unit': 'px', 'value': 25 }],
    'listStyle': 'decimal'
  },
  'courseAccordionMarkdown ol li::marker': {
    'display': 'inline-block',
    'width': [{ 'unit': 'em', 'value': 2 }],
    'listStylePosition': 'inside',
    'textAlign': 'center'
  },
  'courseAccordionMarkdown ol li p': {
    'marginBottom': [{ 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'courseAccordionMarkdown ul': {
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 35 }]
  },
  'courseAccordionMarkdown ul li': {
    'marginBottom': [{ 'unit': 'px', 'value': 10 }],
    'fontSize': [{ 'unit': 'px', 'value': 14 }],
    'lineHeight': [{ 'unit': 'px', 'value': 18 }],
    'listStyle': 'initial'
  },
  'courseAccordionMarkdown ul li::marker': {
    'display': 'inline-block',
    'width': [{ 'unit': 'em', 'value': 2 }],
    'listStylePosition': 'inside',
    'textAlign': 'center'
  },
  'courseAccordionMarkdown ul li p': {
    'marginBottom': [{ 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'courseAccordionMarkdown ul li ul': {
    'margin': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 20 }]
  },
  'courseAccordionMarkdown hr': {
    'height': [{ 'unit': 'px', 'value': 0.5 }],
    'margin': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 0 }],
    'backgroundColor': '#888'
  },
  'courseAccordionMarkdown blockquote': {
    'margin': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 10 }],
    'borderLeft': [{ 'unit': 'px', 'value': 3 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': 'currentcolor' }]
  },
  'courseAccordionMarkdown blockquote p': {
    'marginBottom': [{ 'unit': 'px', 'value': 20 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'courseAccordionMarkdown blockquote p a': {
    'color': '#1c1c1e',
    'fontSize': [{ 'unit': 'px', 'value': 16 }],
    'textDecoration': 'underline'
  },
  'courseAccordionMarkdown p:not(li p)': {
    'lineHeight': [{ 'unit': 'px', 'value': 25 }]
  },
  'courseAccordionMarkdown details': {
    'lineHeight': [{ 'unit': 'px', 'value': 25 }]
  },
  'courseAccordionMarkdown details': {
    'marginBottom': [{ 'unit': 'px', 'value': 5 }],
    'paddingLeft': [{ 'unit': 'px', 'value': 15 }]
  },
  'courseAccordionMarkdown details summary': {
    'fontWeight': '600',
    'cursor': 'pointer'
  },
  'courseAccordionMarkdown pre': {
    'marginBottom': [{ 'unit': 'px', 'value': 20 }]
  },
  'courseAccordionMarkdown reference': {
    'marginBottom': [{ 'unit': 'px', 'value': 8 }],
    'fontWeight': '700',
    'textDecoration': 'underline',
    'cursor': 'pointer'
  },
  'courseAccordionMarkdown img': {
    'display': 'block',
    'maxWidth': [{ 'unit': '%H', 'value': 1 }],
    'height': [{ 'unit': 'string', 'value': 'auto' }, { 'unit': 'string', 'value': '!important' }]
  },
  'courseAccordionMarkdown em': {
    'fontWeight': '700'
  },
  'courseAccordionMarkdown table': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'courseAccordionMarkdown thead': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'courseAccordionMarkdown tbody': {
    'width': [{ 'unit': '%H', 'value': 1 }]
  },
  'courseAccordionMarkdown linkBox': {
    'display': 'flex',
    'position': 'relative',
    'top': [{ 'unit': 'px', 'value': 4 }],
    'justifyContent': 'space-between',
    'marginBottom': [{ 'unit': 'px', 'value': 10 }],
    'padding': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 20 }],
    'borderRadius': '10px',
    'backgroundColor': '#faf9f8',
    'color': 'inherit',
    'fontWeight': '700',
    'lineHeight': [{ 'unit': 'px', 'value': 20 }],
    'textDecoration': 'none',
    'cursor': 'pointer'
  },
  'courseAccordionMarkdown linkBox:hover': {
    'backgroundColor': '#eee'
  },
  'courseAccordionMarkdown sessionImgloading': {
    'width': [{ 'unit': 'px', 'value': 100 }]
  }
});
