**admin auth:**
/baseurl/admin/version/register - POST
/baseurl/admin/version/logout - POST
/baseurl/admin/version/{adminId} - GET
/baseurl/admin/version/forgot-password - POST

**admin event service:**
/baseurl/admin/version/events/{eventId} - GET
/baseurl/admin/version/events/{eventId} - DELETE
/baseurl/admin/version/events/{eventId}/donations - GET
/baseurl/admin/version/events/{eventId}/donations/{donationId} - GET

**NOTES:**
IN THE CREATE EVENT API FOR FEATURED IMAGE DATA, you're asking for "feature_image" as the variable name and then you're returning "featured_image" as variable name when the call succeed.

FOR THE STATUS, in event creation API call, you ask the status as "0" or "1" but then when the GET ALL EVENTS call happens, you return the status as "active" or "inactive". Then again, when UPDATE EVENT STATUS call is happening, you need the status to be "0" or "1". THERE'S NO CONSISTENCY.

I CAN'T TEST OR FIX THE EDIT EVENT INTEGRATION AS THERE'S NO API TO GET EACH EVENT DETAILS and PRE-FILL THE EDIT FORM.

UPDATE STATUS ENDPOINT SHOULD BE /events/{eventId}/status




