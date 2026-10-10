const BookAppointment = () => {
  return (
    <div className="container mx-auto py-16">
      <h2 className="sm:text-4xl text-2xl font-bold text-primary text-center mb-8">
        Book an Appointment
      </h2>
      <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://booking-staging.eva365.app/widget/wk_live_NWH6GfQ5e0k8Gfg2T0qmMwHM11xZClx5?lang=en"
          width="100%"
          height="700"
          style={{ border: 0, maxWidth: '100%' }}
          title="Book an appointment"
        />
      </div>
    </div>
  );
};

export default BookAppointment;
