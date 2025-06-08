In the user details by ID API call, the "total_donors" and "total_donation_amount" might be coming wrong. Doesn't match with the donation details passed with it. Please check.

Menu status doesn't change to inactive. Only can be activated.

The event location isn't getting updated even after a valid create or update API call.

The event image data if not changed in the update process, we won't be able to send base 64 format as the fetched data for prefilling returns an store link/url. I'm currently not sending it at all if not changed as I saw that it's not a required field.