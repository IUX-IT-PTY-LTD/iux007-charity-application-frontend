'use client';
import CharityRequestForm from '@/components/charity-request-form';

const CharityRequestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <CharityRequestForm />
      </div>
    </div>
  );
};

export default CharityRequestPage;