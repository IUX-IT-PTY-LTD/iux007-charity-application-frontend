'use client';

import React from 'react';
import { COMPONENT_TYPES } from '@/app/(admin)/admin/page-builder/components';

// Individual component renderers
const HeroComponent = ({ content }) => {
  const getHeroHeight = () => {
    switch (content.height) {
      case 'small': return '300px';
      case 'medium': return '500px';
      case 'large': return '700px';
      case 'fullscreen': return '100vh';
      case 'custom': return content.customHeight || '500px';
      default: return '500px';
    }
  };

  const getHeroBackground = () => {
    const type = content.backgroundType || 'gradient';
    const overlay = content.backgroundOverlay || 40;
    
    if (type === 'color') {
      return content.backgroundColor || '#667eea';
    } else if (type === 'gradient') {
      const start = content.gradientStart || '#667eea';
      const end = content.gradientEnd || '#764ba2';
      const direction = content.gradientDirection || '135deg';
      return `linear-gradient(${direction}, ${start} 0%, ${end} 100%)`;
    } else if (type === 'image' && content.backgroundImage) {
      return `linear-gradient(rgba(0,0,0,${overlay/100}), rgba(0,0,0,${overlay/100})), url(${content.backgroundImage})`;
    } else {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getButtonClasses = () => {
    const style = content.buttonStyle || 'primary';
    const size = content.buttonSize || 'medium';
    
    let baseClasses = 'inline-block font-semibold rounded-lg transition-colors ';
    
    // Size classes
    switch (size) {
      case 'small':
        baseClasses += 'px-4 py-2 text-sm ';
        break;
      case 'large':
        baseClasses += 'px-10 py-4 text-xl ';
        break;
      default:
        baseClasses += 'px-8 py-4 text-lg ';
    }
    
    // Style classes
    switch (style) {
      case 'secondary':
        baseClasses += 'bg-gray-600 text-white hover:bg-gray-700 ';
        break;
      case 'outline':
        baseClasses += 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 ';
        break;
      case 'ghost':
        baseClasses += 'text-white bg-transparent hover:bg-white hover:bg-opacity-20 ';
        break;
      default:
        baseClasses += 'bg-white text-blue-600 hover:bg-gray-100 ';
    }
    
    return baseClasses;
  };

  return (
    <div 
      className="relative bg-cover bg-center flex items-center justify-center"
      style={{ 
        height: getHeroHeight(),
        background: getHeroBackground(),
        color: content.textColor || '#ffffff'
      }}
    >
      <div className={`text-${content.textAlignment || 'center'} px-4 max-w-4xl mx-auto`}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{content.title || 'Hero Title'}</h1>
        {content.subtitle && (
          <p className="text-xl md:text-2xl mb-8 opacity-90">{content.subtitle}</p>
        )}
        {content.buttonText && (
          <a 
            href={content.buttonLink || '#'}
            className={getButtonClasses()}
          >
            {content.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

const TextComponent = ({ content }) => {
  const getTextClasses = () => {
    let classes = ['prose', 'prose-lg', 'max-w-none', 'py-8'];
    
    // Add alignment
    classes.push(`text-${content.alignment || 'left'}`);
    
    // Add font size (only if not custom) - explicitly handle all font sizes
    const fontSize = content.fontSize || 'base';
    if (fontSize !== 'custom') {
      const fontSizeClasses = {
        'xs': 'text-xs',
        'sm': 'text-sm', 
        'base': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl'
      };
      const fontClass = fontSizeClasses[fontSize];
      if (fontClass) {
        classes.push(fontClass);
      }
    }
    
    // Add line height (only if not custom)
    const lineHeight = content.lineHeight || 'normal';
    if (lineHeight !== 'custom') {
      classes.push(`leading-${lineHeight}`);
    }
    
    // Add font weight
    const fontWeight = content.fontWeight || 'normal';
    classes.push(`font-${fontWeight}`);
    
    return classes.join(' ');
  };

  const getTextStyles = () => {
    let styles = {};
    
    // Custom font size
    if (content.fontSize === 'custom' && content.customFontSize) {
      styles.fontSize = content.customFontSize;
    }
    
    // Custom line height
    if (content.lineHeight === 'custom' && content.customLineHeight) {
      styles.lineHeight = content.customLineHeight;
    }
    
    // Text color (override default if specified)
    if (content.textColor && content.textColor !== '#000000') {
      styles.color = content.textColor;
    }
    
    // Margins
    if (content.marginTop) {
      const marginMap = { 
        none: '0', 
        small: '8px', 
        normal: '32px', // Default py-8 equivalent
        large: '48px', 
        xlarge: '64px' 
      };
      styles.paddingTop = marginMap[content.marginTop] || content.marginTop;
    }
    
    if (content.marginBottom) {
      const marginMap = { 
        none: '0', 
        small: '8px', 
        normal: '32px', // Default py-8 equivalent
        large: '48px', 
        xlarge: '64px' 
      };
      styles.paddingBottom = marginMap[content.marginBottom] || content.marginBottom;
    }
    
    // Line break handling
    styles.whiteSpace = content.preserveLineBreaks === 'preserve' ? 'pre-line' :
      content.preserveLineBreaks === 'nowrap' ? 'nowrap' :
      content.preserveLineBreaks === 'pre' ? 'pre-wrap' : 'normal';
    
    // Content spacing (CSS custom properties for spacing control)
    styles['--content-spacing'] = content.contentSpacing === 'custom' 
      ? content.customContentSpacing 
      : content.contentSpacing === 'tight' ? '0.75rem'
      : content.contentSpacing === 'relaxed' ? '1.5rem'
      : content.contentSpacing === 'loose' ? '2rem'
      : '1rem';
      
    styles['--paragraph-spacing'] = content.paragraphSpacing === 'custom' 
      ? content.customParagraphSpacing 
      : content.paragraphSpacing === 'none' ? '0'
      : content.paragraphSpacing === 'small' ? '0.5rem'
      : content.paragraphSpacing === 'large' ? '1.5rem'
      : content.paragraphSpacing === 'xlarge' ? '2rem'
      : '1rem';
    
    return styles;
  };

  const processContentSpacing = (html) => {
    if (!html) return html;
    
    // Get spacing values
    const contentSpacing = content.contentSpacing === 'custom' 
      ? content.customContentSpacing 
      : content.contentSpacing === 'tight' ? '0.75rem'
      : content.contentSpacing === 'relaxed' ? '1.5rem'
      : content.contentSpacing === 'loose' ? '2rem'
      : '1rem';
      
    const paragraphSpacing = content.paragraphSpacing === 'custom' 
      ? content.customParagraphSpacing 
      : content.paragraphSpacing === 'none' ? '0'
      : content.paragraphSpacing === 'small' ? '0.5rem'
      : content.paragraphSpacing === 'large' ? '1.5rem'
      : content.paragraphSpacing === 'xlarge' ? '2rem'
      : '1rem';
    
    // Process HTML with direct spacing values
    let processedHtml = html;
    
    // First, remove any existing spacing divs to avoid duplicates
    processedHtml = processedHtml.replace(
      /<div style="height: [^"]*; margin: 0; padding: 0;"><\/div>/g, 
      ''
    );
    
    // Add spacing after paragraphs
    if (paragraphSpacing && paragraphSpacing !== '0') {
      processedHtml = processedHtml.replace(
        /<\/p>/g, 
        `</p><div style="height: ${paragraphSpacing}; margin: 0; padding: 0;"></div>`
      );
    }
    
    // Add spacing after headings, lists, and blockquotes (but not divs to avoid conflicts)
    if (contentSpacing && contentSpacing !== '0') {
      processedHtml = processedHtml.replace(
        /<\/(h[1-6]|ul|ol|blockquote)>/g, 
        `</$1><div style="height: ${contentSpacing}; margin: 0; padding: 0;"></div>`
      );
    }
    
    return processedHtml;
  };

  return (
    <div 
      className={getTextClasses()}
      style={getTextStyles()}
    >
      <div dangerouslySetInnerHTML={{ __html: processContentSpacing(content.text) }} />
    </div>
  );
};

const ImageComponent = ({ content }) => {
  const getImageDimensions = () => {
    const sizeMode = content.sizeMode || 'responsive';
    let style = {};
    let className = '';

    switch (sizeMode) {
      case 'custom':
        if (content.customWidth) {
          style.width = content.customWidth;
        }
        if (content.customHeight) {
          style.height = content.customHeight;
        }
        break;
      case 'preset':
        const presetSize = content.presetSize || 'medium';
        switch (presetSize) {
          case 'small':
            style = { width: '200px', height: '150px' };
            break;
          case 'medium':
            style = { width: '400px', height: '300px' };
            break;
          case 'large':
            style = { width: '600px', height: '450px' };
            break;
          case 'xlarge':
            style = { width: '800px', height: '600px' };
            break;
          case 'thumbnail':
            style = { width: '100px', height: '100px' };
            break;
          case 'banner':
            style = { width: '1200px', height: '300px' };
            break;
        }
        break;
      case 'responsive':
        className = 'max-w-full h-auto';
        break;
      case 'auto':
        className = 'h-auto';
        break;
      default:
        className = 'max-w-full h-auto';
        break;
    }

    return { style, className };
  };

  const getImageClasses = () => {
    let classes = [];
    
    // Add dimension classes
    const { className } = getImageDimensions();
    if (className) classes.push(className);
    
    // Add border radius
    const borderRadius = content.borderRadius || 'none';
    if (borderRadius !== 'none') {
      classes.push(borderRadius);
    }
    
    // Add shadow
    const shadow = content.shadow || 'none';
    if (shadow !== 'none') {
      classes.push(shadow);
    }
    
    // Add border
    const border = content.border || 'none';
    if (border !== 'none') {
      classes.push(border);
    }
    
    // Add object fit for custom/preset sizes
    const sizeMode = content.sizeMode || 'responsive';
    if (sizeMode === 'custom' || sizeMode === 'preset') {
      const objectFit = content.objectFit || 'cover';
      classes.push(`object-${objectFit}`);
    }
    
    return classes.join(' ');
  };

  return (
    <div className={`py-8 text-${content.alignment || 'center'}`}>
      {content.src ? (
        <div className="inline-block">
          <img 
            src={content.src} 
            alt={content.alt || 'Image'}
            style={getImageDimensions().style}
            className={getImageClasses()}
          />
          {content.caption && (
            <p className="text-sm text-gray-600 mt-4 italic">{content.caption}</p>
          )}
        </div>
      ) : (
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No image selected</span>
        </div>
      )}
    </div>
  );
};

const CtaComponent = ({ content }) => (
  <div 
    className={`text-white p-12 rounded-lg text-center my-8 ${
      content.backgroundColor === 'blue' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
      content.backgroundColor === 'green' ? 'bg-gradient-to-r from-green-500 to-teal-600' :
      content.backgroundColor === 'red' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
      'bg-gradient-to-r from-blue-500 to-purple-600'
    }`}
  >
    <h3 className="text-3xl font-bold mb-4">{content.title}</h3>
    <p className="text-xl mb-8 opacity-90">{content.description}</p>
    {content.buttonText && content.buttonLink && (
      <a 
        href={content.buttonLink}
        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        {content.buttonText}
      </a>
    )}
  </div>
);

const TestimonialComponent = ({ content }) => (
  <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-blue-500 my-8">
    <blockquote className="text-xl italic mb-6">
      "{content.quote}"
    </blockquote>
    <div className="flex items-center">
      {content.avatar && (
        <img 
          src={content.avatar} 
          alt={content.author}
          className="w-16 h-16 rounded-full mr-4"
        />
      )}
      <div>
        <div className="font-semibold text-lg">{content.author}</div>
        <div className="text-gray-600">{content.role}</div>
        {content.rating && (
          <div className="text-yellow-500 mt-1">
            {'★'.repeat(content.rating)}{'☆'.repeat(5 - content.rating)}
          </div>
        )}
      </div>
    </div>
  </div>
);

const ColumnsComponent = ({ content }) => (
  <div className={`grid gap-8 my-8 ${
    content.layout === 'equal' ? 'grid-cols-1 md:grid-cols-3' :
    content.layout === 'featured' ? 'grid-cols-1 lg:grid-cols-2' :
    content.layout === 'sidebar' ? 'grid-cols-1 lg:grid-cols-3' :
    'grid-cols-1 md:grid-cols-3'
  }`}>
    {content.columns.map((column, idx) => (
      <div key={idx} className={`text-center p-6 bg-white rounded-lg shadow-lg ${
        content.layout === 'featured' && idx === 0 ? 'lg:col-span-1' : ''
      }`}>
        <div className="text-4xl mb-4">{column.icon}</div>
        <h4 className="text-xl font-semibold mb-3">{column.title}</h4>
        <p className="text-gray-600">{column.text}</p>
      </div>
    ))}
  </div>
);

const SpacerComponent = ({ content }) => (
  <div 
    style={{ height: content.height }}
    className="w-full"
  />
);

const VideoComponent = ({ content }) => (
  <div className="py-8">
    <div className="max-w-4xl mx-auto">
      {content.title && (
        <h3 className="text-2xl font-bold mb-4 text-center">{content.title}</h3>
      )}
      {content.description && (
        <p className="text-gray-600 mb-6 text-center">{content.description}</p>
      )}
      {content.url && (
        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={content.url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  </div>
);

const FormComponent = ({ content }) => (
  <div className="py-8">
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">{content.title}</h3>
      {content.description && (
        <p className="text-gray-600 mb-6">{content.description}</p>
      )}
      <form className="space-y-4">
        {content.fields.map((field, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {content.submitText || 'Submit'}
        </button>
      </form>
    </div>
  </div>
);

// Main component renderer
const ComponentRenderer = ({ component }) => {
  if (!component || !component.type) {
    return null;
  }

  switch (component.type) {
    case COMPONENT_TYPES.HERO:
      return <HeroComponent content={component.content} />;
    
    case COMPONENT_TYPES.TEXT:
      return <TextComponent content={component.content} />;
    
    case COMPONENT_TYPES.IMAGE:
      return <ImageComponent content={component.content} />;
    
    case COMPONENT_TYPES.CTA:
      return <CtaComponent content={component.content} />;
    
    case COMPONENT_TYPES.TESTIMONIAL:
      return <TestimonialComponent content={component.content} />;
    
    case COMPONENT_TYPES.COLUMNS:
      return <ColumnsComponent content={component.content} />;
    
    case COMPONENT_TYPES.SPACER:
      return <SpacerComponent content={component.content} />;
    
    case COMPONENT_TYPES.VIDEO:
      return <VideoComponent content={component.content} />;
    
    case COMPONENT_TYPES.FORM:
      return <FormComponent content={component.content} />;
    
    default:
      return (
        <div className="p-4 bg-gray-100 rounded border-2 border-dashed my-4">
          <p className="text-gray-600">Unknown component type: {component.type}</p>
        </div>
      );
  }
};

export default ComponentRenderer;