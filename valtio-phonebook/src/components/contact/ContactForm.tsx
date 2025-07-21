import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { createContact, updateContact } from '@/store/slices/contactsSlice';
import { closeContactForm } from '@/store/slices/uiSlice';
import { Contact, PhoneNumber, Email } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const phoneSchema = yup.object({
  number: yup.string().required('Phone number is required'),
  type: yup.string().oneOf(['mobile', 'home', 'work', 'other']).required(),
  isPrimary: yup.boolean(),
});

const emailSchema = yup.object({
  address: yup.string().email('Invalid email').required('Email is required'),
  type: yup.string().oneOf(['personal', 'work', 'other']).required(),
  isPrimary: yup.boolean(),
});

const contactSchema = yup.object({
  name: yup.object({
    first: yup.string().required('First name is required'),
    last: yup.string().required('Last name is required'),
    middle: yup.string(),
  }),
  phones: yup.array().of(phoneSchema).min(1, 'At least one phone number is required'),
  emails: yup.array().of(emailSchema),
  company: yup.string(),
  notes: yup.string(),
  address: yup.object({
    street: yup.string(),
    city: yup.string(),
    state: yup.string(),
    postalCode: yup.string(),
    country: yup.string(),
  }).nullable(),
});

type FormData = yup.InferType<typeof contactSchema>;

const ContactForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedContact } = useSelector((state: RootState) => state.ui);
  const contact = useSelector((state: RootState) => 
    selectedContact ? state.contacts.contacts[selectedContact] : undefined
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: { first: '', last: '', middle: '' },
      phones: [{ id: uuidv4(), number: '', type: 'mobile', isPrimary: true }],
      emails: [],
      company: '',
      notes: '',
      address: null,
    },
  });

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control,
    name: 'phones',
  });

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control,
    name: 'emails',
  });

  useEffect(() => {
    if (contact) {
      reset({
        name: contact.name,
        phones: contact.phones,
        emails: contact.emails,
        company: contact.company || '',
        notes: contact.notes || '',
        address: contact.address || null,
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const contactData = {
        ...data,
        id: contact?.id || uuidv4(),
        groups: contact?.groups || [],
        isFavorite: contact?.isFavorite || false,
        createdAt: contact?.createdAt || new Date(),
        updatedAt: new Date(),
        phones: data.phones.map((phone, index) => ({
          ...phone,
          id: phone.id || uuidv4(),
          isPrimary: index === 0, // First phone is always primary
        })),
        emails: data.emails.map((email, index) => ({
          ...email,
          id: email.id || uuidv4(),
          isPrimary: index === 0, // First email is always primary
        })),
      };

      if (contact) {
        await dispatch(updateContact({ id: contact.id, contact: contactData }));
      } else {
        await dispatch(createContact({ contact: contactData }));
      }

      dispatch(closeContactForm());
      reset();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleClose = () => {
    dispatch(closeContactForm());
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {contact ? 'Edit Contact' : 'Add Contact'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name *
                </label>
                <input
                  {...register('name.first')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.name?.first && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.first.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Middle Name
                </label>
                <input
                  {...register('name.middle')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name *
                </label>
                <input
                  {...register('name.last')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.name?.last && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.last.message}</p>
                )}
              </div>
            </div>

            {/* Phone Numbers */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Numbers *
                </label>
                <button
                  type="button"
                  onClick={() => appendPhone({ id: uuidv4(), number: '', type: 'mobile', isPrimary: false })}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Phone
                </button>
              </div>
              {phoneFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input
                    {...register(`phones.${index}.number` as const)}
                    placeholder="Phone number"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <select
                    {...register(`phones.${index}.type` as const)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="mobile">Mobile</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                  {phoneFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {errors.phones && (
                <p className="text-red-500 text-sm">{errors.phones.message}</p>
              )}
            </div>

            {/* Email Addresses */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Addresses
                </label>
                <button
                  type="button"
                  onClick={() => appendEmail({ id: uuidv4(), address: '', type: 'personal', isPrimary: false })}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Email
                </button>
              </div>
              {emailFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input
                    {...register(`emails.${index}.address` as const)}
                    placeholder="Email address"
                    type="email"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <select
                    {...register(`emails.${index}.type` as const)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company
              </label>
              <input
                {...register('company')}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : contact ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;