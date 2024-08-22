# Job Application Tracker

https://job-application-tracker-five.vercel.app/

<br>

## Technologies

Next.js, TypeScript, SASS.

<br>

## Dependencies

- **react-dropzone:** Simple React hook to create a HTML5-compliant drag'n'drop zone for files.

https://react-dropzone.js.org/

- **zod:** Schema Validation.

https://zod.dev/

- **dompurify:** XSS Sanitizer for HTML.

https://github.com/cure53/DOMPurify

- **@types/dompurify:** Types for dompurify

<br>

## Observations

- **Maximum Size for Local Storage:** The maximum size across the most popular browsers is 5-10 MB. The maximum JSON file size for this application is set to 3MB, this avoids reaching the limit.