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

const TextComponent = ({ content }) => (
  <div className={`prose prose-lg max-w-none text-${content.alignment || 'left'} py-8`}>
    <div dangerouslySetInnerHTML={{ __html: content.text }} />
  </div>
);

const ImageComponent = ({ content }) => (
  <div className={`py-8 text-${content.alignment || 'center'}`}>
    {content.src ? (
      <div className={content.width === 'full' ? 'w-full' : 'inline-block'}>
        <img 
          src={content.src} 
          alt={content.alt}
          className="max-w-full h-auto rounded-lg shadow-lg"
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