**admin auth:**
/baseurl/admin/version/register - POST
/baseurl/admin/version/logout - POST
/baseurl/admin/version/{adminId} - GET
/baseurl/admin/version/forgot-password - POST

"?title=Gaza Iftar Meal&featured=1&status=1&per_page=10&current_page=1"

**admin event service:**

/baseurl/admin/version/events/{eventId}/donations/{donationId} - GET

**NOTES:**
IN THE CREATE EVENT API FOR FEATURED IMAGE DATA, you're asking for "feature_image" as the variable name and then you're returning "featured_image" as variable name when the call succeed.

FOR THE STATUS, in event creation API call, you ask the status as "0" or "1" but then when the GET ALL EVENTS call happens, you return the status as "active" or "inactive". Then again, when UPDATE EVENT STATUS call is happening, you need the status to be "0" or "1". THERE'S NO CONSISTENCY.

I CAN'T TEST OR FIX THE EDIT EVENT INTEGRATION AS THERE'S NO API TO GET EACH EVENT DETAILS and PRE-FILL THE EDIT FORM.

UPDATE STATUS ENDPOINT SHOULD BE /events/{eventId}/status

**slider service:**
/baseurl/admin/version/sliders/{sliderId} - GET

THE UPDATE AND DELETE ENDPOINTS ARE NOT FOLLOWING RESTFUL CONVENTION. IT SHOULD BE LIKE BELOW:

/baseurl/admin/version/sliders/{sliderId}/update
/baseurl/admin/version/sliders/{sliderId}/delete

GET ALL SLIDER OR ANY SLIDER ENDPOINT DOESN'T RETURN THE SLIDER STATUS DATA. ALSO, THERE'S NO ENDPOINT TO UPDATE THE SLIDER STATUS ONLY.
I DON"T EVEN KNOW IF THE SLIDER STATUS IS A THING OR NOT.


**FAQ Service:**
THE ENDPOINTS FOR FAQs ARE NOT FOLLOWING RESTFUL CONVENTION. Explanation is provided in the previous service for the same concerns. Please refer to that.

**Contact Us:**
/baseurl/admin/version/contact-us/create - POST
/baseurl/admin/version/contact-us/{contactId}/delete - DELETE

**USERS:**
USER DETAILS API IS NOT WORKING

**IMPORTANT NOTE:**
PLEASE MAKE SURE TO PROVIDE THE FOLLOWING ENDPOINTS FOR EVERY CATEGORY:

GET - to get all the records of a single category
POST - to create a record within that category
GET - to fetch the record by ID within that category
PUT - to update the record by ID
DELETE - to delete the record

*IF THE RECORD REQUIRES CERTAIN DATA SPECIFIC UPDATES (e.g. status change), provide the following for that data field:*
GET - to fetch the record's specific field data by ID
POST/ PUT - to update that specific field's data by ID


**MENU SERVICE:**
Slug can't be updated in Edit.


**USERS/CUSTOMERS ACCOUNT LIST AND ALL RELATED ENDPOINTS ARE MISSING**

**ALL ADMIN PROFILE SERVICE RELATED ENDPOINTS ARE MISSING (e.g. PROFILE UPDATE, PASSWORD UPDATE etc.)**

**SEVERAL OTHER ENDPOINTS ARE STILL MISSING, PLEASE RUN THE FRONTEND AND CHECK. THANK YOU.**

