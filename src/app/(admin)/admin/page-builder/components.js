// Component types for the page builder
export const COMPONENT_TYPES = {
  HERO: 'hero',
  TEXT: 'text',
  IMAGE: 'image',
  GALLERY: 'gallery',
  TESTIMONIAL: 'testimonial',
  CTA: 'cta',
  SPACER: 'spacer',
  COLUMNS: 'columns',
  VIDEO: 'video',
  FORM: 'form',
};

// Default component templates
export const getDefaultComponent = (type) => {
  const defaults = {
    [COMPONENT_TYPES.HERO]: {
      id: Date.now(),
      type: COMPONENT_TYPES.HERO,
      content: {
        title: 'Welcome to Our Website',
        subtitle: 'Discover amazing content and services',
        backgroundImage: '',
        buttonText: 'Learn More',
        buttonLink: '#',
        overlayOpacity: 0.5,
      },
    },
    [COMPONENT_TYPES.TEXT]: {
      id: Date.now(),
      type: COMPONENT_TYPES.TEXT,
      content: {
        text: '<h2>Your Heading Here</h2><p>Add your content here. You can use HTML formatting to style your text.</p>',
        alignment: 'left',
      },
    },
    [COMPONENT_TYPES.IMAGE]: {
      id: Date.now(),
      type: COMPONENT_TYPES.IMAGE,
      content: {
        src: '',
        alt: 'Image description',
        caption: '',
        alignment: 'center',
        sizeMode: 'responsive',
        customWidth: '',
        customHeight: '',
        presetSize: 'medium',
        objectFit: 'cover',
        borderRadius: 'none',
        shadow: 'none',
        border: 'none',
      },
    },
    [COMPONENT_TYPES.GALLERY]: {
      id: Date.now(),
      type: COMPONENT_TYPES.GALLERY,
      content: {
        images: [],
        columns: 3,
        spacing: 'medium',
      },
    },
    [COMPONENT_TYPES.TESTIMONIAL]: {
      id: Date.now(),
      type: COMPONENT_TYPES.TESTIMONIAL,
      content: {
        quote: 'This service has transformed our business completely. Highly recommended!',
        author: 'John Doe',
        role: 'CEO, Company Name',
        avatar: '',
        rating: 5,
      },
    },
    [COMPONENT_TYPES.CTA]: {
      id: Date.now(),
      type: COMPONENT_TYPES.CTA,
      content: {
        title: 'Ready to Get Started?',
        description: 'Join thousands of satisfied customers and take your business to the next level.',
        buttonText: 'Get Started Now',
        buttonLink: '#',
        backgroundColor: 'blue',
      },
    },
    [COMPONENT_TYPES.SPACER]: {
      id: Date.now(),
      type: COMPONENT_TYPES.SPACER,
      content: {
        height: '50px',
      },
    },
    [COMPONENT_TYPES.COLUMNS]: {
      id: Date.now(),
      type: COMPONENT_TYPES.COLUMNS,
      content: {
        columns: [
          { 
            title: 'Feature One', 
            text: 'Description of your first feature or service.',
            icon: '🚀'
          },
          { 
            title: 'Feature Two', 
            text: 'Description of your second feature or service.',
            icon: '⭐'
          },
          { 
            title: 'Feature Three', 
            text: 'Description of your third feature or service.',
            icon: '💡'
          },
        ],
        layout: 'equal',
      },
    },
    [COMPONENT_TYPES.VIDEO]: {
      id: Date.now(),
      type: COMPONENT_TYPES.VIDEO,
      content: {
        url: '',
        title: 'Video Title',
        description: 'Video description',
        autoplay: false,
        controls: true,
      },
    },
    [COMPONENT_TYPES.FORM]: {
      id: Date.now(),
      type: COMPONENT_TYPES.FORM,
      content: {
        title: 'Contact Us',
        description: 'Get in touch with us',
        fields: [
          { type: 'text', label: 'Name', required: true },
          { type: 'email', label: 'Email', required: true },
          { type: 'textarea', label: 'Message', required: true },
        ],
        submitText: 'Send Message',
      },
    },
  };

  return defaults[type] || defaults[COMPONENT_TYPES.TEXT];
};