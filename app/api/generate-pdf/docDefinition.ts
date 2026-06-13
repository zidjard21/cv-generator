import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

// Build docDefinition dynamically from JSON data
const buildDocDefinition = (cvData: any): Content[] => {
  const profileImageBase64 = cvData.profileImageBase64 || '';
  const content: Content[] = [];

  // --- HEADER SECTION ---
  content.push({
    layout: 'noBorders',
    table: {
      widths: ['*'],
      body: [
        [
          {
            fillColor: '#F2F2F2',
            margin: [35, 20, 15, 20],
            columns: [
              {
                image: profileImageBase64,
                width: 85,
                height: 85,
                alignment: 'center',
                margin: [0, 0, 15, 0]
              },
              {
                width: '*',
                stack: [
                  { text: cvData.personalInfo.name, style: 'name' },
                  { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 455, y2: 0, lineWidth: 1, lineColor: '#C0C0C0' }], margin: [0, 6, 0, 0] },
                  {
                    text: [
                      // { text: 'Phone number: ', style: 'contactLabel' },
                      { text: 'Numéro de téléphone: ', style: 'contactLabel' },
                      cvData.personalInfo.phone + '  |  ',
                      // { text: 'Email address: ', style: 'contactLabel' },
                      { text: 'Adresse e-mail: ', style: 'contactLabel' },
                      { text: cvData.personalInfo.email, link: `mailto:${cvData.personalInfo.email}`, style: 'link' },
                      '  |'
                    ],
                    style: 'contactItem'
                  },
                  {
                    text: [
                      { text: 'LinkedIn: ', style: 'contactLabel' },
                      { text: cvData.personalInfo.linkedin, link: cvData.personalInfo.linkedin, style: 'link' },
                      '  |'
                    ],
                    style: 'contactItem'
                  },
                  {
                    text: [
                      // { text: 'Address: ', style: 'contactLabel' },
                      { text: 'Adresse: ', style: 'contactLabel' },
                      cvData.personalInfo.address
                    ],
                    style: 'contactItem'
                  }
                ]
              }
            ]
          }
        ]
      ]
    },
    margin: [-30, -20, -30, 10]
  });

  // --- ABOUT ME ---
  content.push({
    text: [
      { text: '●  ', style: 'sectionBullet' },
      // { text: 'ABOUT ME', style: 'sectionTitle' }
      { text: 'À PROPOS DE MOI', style: 'sectionTitle' }
    ],
    style: 'sectionHeader'
  });
  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 545, y2: 0, lineWidth: 1, lineColor: '#999999' }], margin: [0, 0, 0, 8] });
  content.push({ 
    text: cvData.aboutMe, 
    style: 'bodyText', 
    margin: [0, 0, 0, 10] 
  });

  // --- WORK EXPERIENCE ---
  content.push({
    text: [
      { text: '●  ', style: 'sectionBullet' },
      // { text: 'WORK EXPERIENCE', style: 'sectionTitle' }
      { text: 'EXPÉRIENCE PROFESSIONNELLE', style: 'sectionTitle' }
    ],
    style: 'sectionHeader'
  });
  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 545, y2: 0, lineWidth: 1, lineColor: '#999999' }], margin: [0, 0, 0, 10] });

  cvData.workExperience.forEach((job: any) => {
    content.push({
      text: [
        { text: `${job.title} – `, style: 'jobTitleBold' },
        { text: job.company + ' – ', style: 'jobTitleBold' },
        { text: `${job.startDate} – ${job.endDate}`, style: 'jobTitleDate' }
      ],
      style: 'jobTitle'
    });
    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 0.5, lineColor: '#CCCCCC' }], margin: [0, 0, 0, 6] });
    content.push({
      ul: job.responsibilities,
      style: 'bulletList'
    });
  });

  // --- EDUCATION ---
  content.push({
    text: [
      { text: '●  ', style: 'sectionBullet' },
      // { text: 'EDUCATION AND TRAINING', style: 'sectionTitle' }
      { text: 'ÉDUCATION ET FORMATION', style: 'sectionTitle' }
    ],
    style: 'sectionHeader'
  });
  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 545, y2: 0, lineWidth: 1, lineColor: '#999999' }], margin: [0, 0, 0, 8] });

  cvData.education.forEach((edu: any, index: number) => {
    content.push({ text: edu.year, style: 'eduYear' });
    content.push({
      text: [
        { text: edu.degree + ' ', style: 'eduDegree' },
        { text: edu.institution, style: 'eduInstitution' }
      ],
      margin: [0, 0, 0, 6]
    });
    if (index < cvData.education.length - 1) {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 545, y2: 0, lineWidth: 0.5, lineColor: '#999999' }], margin: [0, 0, 0, 10] });
    }
  });

  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 545, y2: 0, lineWidth: 0.5, lineColor: '#999999' }], margin: [0, 0, 0, 14] });

  // --- LANGUAGE SKILLS ---
  content.push({
    text: [
      { text: '●  ', style: 'sectionBullet' },
      // { text: 'LANGUAGE SKILLS', style: 'sectionTitle' }
      { text: 'COMPÉTENCES LINGUISTIQUES', style: 'sectionTitle' }
    ],
    style: 'sectionHeader'
  });
  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 545, y2: 0, lineWidth: 1, lineColor: '#999999' }], margin: [0, 0, 0, 8] });

  // Build language table from JSON
  const languageTableBody: any[][] = [
    [
      '',
      // { text: 'UNDERSTANDING', colSpan: 2, alignment: 'center', bold: true, fontSize: 9.5 },
      { text: 'COMPREHENSION', colSpan: 2, alignment: 'center', bold: true, fontSize: 9.5 },
      {},
      // { text: 'SPEAKING', colSpan: 2, alignment: 'center', bold: true, fontSize: 9.5 },
      { text: 'EXPRESSION ORALE', colSpan: 2, alignment: 'center', bold: true, fontSize: 9.5 },
      {},
      // { text: 'WRITING', alignment: 'center', bold: true, fontSize: 9.5 }
      { text: 'ÉCRIT', alignment: 'center', bold: true, fontSize: 9.5 }
    ],
    [
      '',
      // { text: 'Listening', alignment: 'center', fontSize: 9.5 },
      // { text: 'Reading', alignment: 'center', fontSize: 9.5 },
      // { text: 'Spoken production', alignment: 'center', fontSize: 9.5 },
      // { text: 'Spoken interaction', alignment: 'center', fontSize: 9.5 },
      { text: 'Compréhension orale', alignment: 'center', fontSize: 9.5 },
      { text: 'Compréhension écrite', alignment: 'center', fontSize: 9.5 },
      { text: 'Expression orale en continu', alignment: 'center', fontSize: 9.5 },
      { text: 'Interaction orale', alignment: 'center', fontSize: 9.5 },
      ''
    ]
  ];

  cvData.languages.forEach((lang: any) => {
    languageTableBody.push([
      { text: lang.language, style: 'tableLanguageBold' },
      { text: lang.listening, style: 'tableLevel' },
      { text: lang.reading, style: 'tableLevel' },
      { text: lang.spokenProduction, style: 'tableLevel' },
      { text: lang.spokenInteraction, style: 'tableLevel' },
      { text: lang.writing, style: 'tableLevel' }
    ]);
  });

  content.push({
    layout: {
      hLineWidth: function (i: number, node: any): number {
        return (i === 1 || i === 2) ? 0.5 : 0;
      },
      vLineWidth: function (i: number, node: any): number { return 0; },
      hLineColor: function (i: number, node: any): string { return '#CCCCCC'; },
      fillColor: function (rowIndex: number, node: any, columnIndex: number): string | null {
        if (rowIndex === 2 || rowIndex === 4) return '#F5F5F5';
        return null;
      },
      paddingTop: function(i: number, node: any): number { return 6; },
      paddingBottom: function(i: number, node: any): number { return 6; }
    },
    table: {
      headerRows: 2,
      widths: ['*', '*', '*', '*', '*', '*'],
      body: languageTableBody
    },
    margin: [0, 0, -10, 5]
  });

  // content.push({ text: 'Levels: A1 and A2: Basic user; B1 and B2: Independent user; C1 and C2: Proficient user', style: 'footnote' });
  content.push({ text: 'Niveaux: A1 et A2: utilisateur de base; B1 et B2: utilisateur indépendant; C1 et C2: utilisateur expérimenté', style: 'footnote' });

  // --- SKILLS ---
  content.push({
    text: [
      { text: '●  ', style: 'sectionBullet' },
      // { text: 'SKILLS', style: 'sectionTitle' }
      { text: 'Compétences', style: 'sectionTitle' }
    ],
    style: 'sectionHeader'
  });
  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 545, y2: 0, lineWidth: 1, lineColor: '#999999' }], margin: [0, 0, 0, 8] });

  cvData.skills.forEach((skillGroup: any) => {
    if (skillGroup.items && skillGroup.items.length > 0) {
      content.push({ text: skillGroup.category, style: 'skillCategory' });
      content.push({ text: skillGroup.items.join('  |  '), style: 'skillList' });
    }
  });

  return content;
};

/**
 * Create a complete docDefinition object from resume data
 * @param {Object} cvData - The resume/CV data object
 * @returns {Object} Complete pdfmake docDefinition
 */
export function createDocDefinition(cvData: any): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [30, 20, 30, 20],
    
    // 0. Document Metadata for ATS Optimization
    info: {
      title: cvData.documentMetadata.title,
      author: cvData.personalInfo.name,
      subject: cvData.documentMetadata.subject,
      keywords: cvData.documentMetadata.keywords
    },
    
    // 1. Default Document Styling
    defaultStyle: {
      font: 'Roboto', 
      fontSize: 10,
      color: '#333333', 
      lineHeight: 1.1
    },
    
    content: buildDocDefinition(cvData),

    // 2. The Comprehensive Styles Dictionary
    styles: {
      name: {
        fontSize: 17,
        font: 'RobotoBlack',
        bold: true,
        color: '#4d4c4c', 
        margin: [0, -8, 0, 0],
        characterSpacing: 0.5
      },
      contactItem: {
        fontSize: 10,
        color: '#000000',
        margin: [0, 8, 0, 0]
      },
      link: {
        fontSize: 10,
        color: '#0056b3', 
        decoration: 'underline',
        margin: [0, 8, 0, 0]
      },
      sectionTitle: {
        fontSize: 12,
        font: 'RobotoBlack',
        bold: true,
        color: '#000000'
      },
      bodyText: {
        fontSize: 10,
        margin: [0, 0, 0, 6],
        alignment: 'justify'
      },
      jobTitle: {
        fontSize: 10,
        bold: true,
        color: '#1A1A1A',
        margin: [0, 0, 0, 2],
        // margin: [0, 10, 0, 2]
      },
      subTitle: {
        fontSize: 10,
        italics: true,
        color: '#555555'
      },
      bulletList: {
        margin: [12, 2, 0, 12], 
        markerColor: '#555555' 
      },
      tableHeader: {
        bold: true,
        fontSize: 9,
        color: '#555555'
      },
      tableSubHeader: {
        italics: true,
        fontSize: 9,
        color: '#777777'
      },
      footnote: {
        fontSize: 8,
        italics: true,
        color: '#999999',
        margin: [0, 2, 0, 10]
      },
      skillCategory: {
        fontSize: 10,
        bold: true,
        color: '#1A1A1A',
        margin: [0, 8, 0, 2]
      },
      skillList: {
        fontSize: 10,
        color: '#555555',
        margin: [0, 2, 0, 4]
      },

      eduYear: {
        fontSize: 10,
        bold: true
      },

      eduDegree: {
        bold: true
      },

      eduInstitution: {
        color: '#555555'
      },

      jobTitleBold: {
        bold: true,
        color: '#444444'
      },

      jobTitleDate: {
        color: '#777777'
      },

      sectionBullet: {
        color: '#999999',
        fontSize: 12
      },

      sectionHeader: {
        margin: [-15, 0, 0, 4]
      },

      tableLanguageBold: {
        bold: true,
        color: '#000'
      },

      tableLevel: {
        alignment: 'center'
      },

      contactLabel: {
        bold: true,
        color: '#000000'
      },

      contactValue: {
        color: '#666666'
      }
    }
  };
}