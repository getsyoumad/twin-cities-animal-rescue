# Twin Cities Animal Rescue

Sophia Introduction to Web Development, Touchstones 2, 3, and 4.
This coursework continues the four HTML pages from Touchstone Task 2, adds one shared external CSS file in Touchstone 3, and adds an interest planner, JavaScript validation, and browser storage in Touchstone 4.

## Pages
- `index.html`: mission, text impact figures, and ways to help
- `services.html`: adoption, fostering, volunteering, and pet spotlight
- `about.html`: organization story, values, partners, and provided video
- `contact.html`: service area, office hours, and validated interest form

## Preview
Open `index.html` after extracting the entire project, or use a web server/your editor's HTML preview. Keep the `Animal Shelter_c` folder beside the HTML files. In VS Code for Education, upload the HTML files, `styles.css`, and the media folder while preserving that structure.

The CSS starts with a single column and uses Flexbox plus an 800px media query for wider screens. The palette uses four colors and two font families.

The impact figures and office hours are illustrative student content. The form demonstrates validation and has no message delivery service. All rescue media comes from the provided course ZIP.

## Touchstone 4 interaction
On Ways to Help, choose an interest to see a recommendation and next steps. Remember the interest, refresh, then continue to the contact form to see the selected interest restored. Forget my saved interest removes only this site's preference. The form checks required fields, email format, and length limits with inline messages, retains entries after errors, and displays a classroom completion message for valid entries.

`script.js` uses the `interestOptions` and `fieldRules` arrays and multiple functions to organize these behaviors. Only the interest identifier is saved in localStorage under `tc-rescue-interest-v1`; contact details and messages are not stored. If storage is unavailable, visitors can still select an interest and use the form.
