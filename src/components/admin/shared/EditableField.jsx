'use client';

import { useState } from 'react';
import { Pencil, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

/**
 * EditableField component for in-place editing
 * @param {Object} props - Component props
 * @param {string} props.label - Field label
 * @param {string|number} props.value - Current field value
 * @param {string} props.icon - Optional icon component
 * @param {function} props.onSave - Function to call when saving changes
 * @param {string} props.type - Input type: 'text', 'textarea', 'toggle', 'email', 'password'
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {string} props.placeholder - Placeholder text for input
 * @param {boolean} props.required - Whether the field is required
 */
const EditableField = ({
  label,
  value,
  icon: Icon,
  onSave,
  type = 'text',
  disabled = false,
  placeholder = 'Enter value...',
  required = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(value);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value);
    setError('');
  };

  const handleSave = async () => {
    // Validate for required fields
    if (required && !inputValue) {
      setError('This field is required');
      return;
    }

    // Email validation
    if (type === 'email' && inputValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Password validation
    if (type === 'password' && inputValue && inputValue.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSave(inputValue);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = async (checked) => {
    setIsLoading(true);
    try {
      await onSave(checked ? 1 : 0);
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggle input separately
  if (type === 'toggle') {
    return (
      <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <Label htmlFor={`toggle-${label}`} className="text-sm font-medium">
              {label}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Switch
                id={`toggle-${label}`}
                checked={value === 1}
                onCheckedChange={handleToggleChange}
                disabled={disabled || isLoading}
              />
            )}
          </div>
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            <Label className="text-sm font-medium">{label}</Label>
          </div>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={handleEdit} disabled={disabled}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            {type === 'textarea' ? (
              <Textarea
                value={inputValue || ''}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className={error ? 'border-destructive' : ''}
                disabled={isLoading}
                rows={3}
              />
            ) : (
              <Input
                type={type === 'password' ? 'password' : type === 'email' ? 'email' : 'text'}
                value={inputValue || ''}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className={error ? 'border-destructive' : ''}
                disabled={isLoading}
              />
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end space-x-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-base py-1.5">
            {value ? (
              <span>{type === 'password' ? '••••••••' : value}</span>
            ) : (
              <span className="text-muted-foreground italic">Not set</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableField;
