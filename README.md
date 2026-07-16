# SMRTTECH 3CC3 Unified Lab Portal

This repository contains the student-facing GitHub Pages build of the SMRTTECH 3CC3 interactive laboratory portal. Instructor and TA tools remain in the private source repository.

Live site: https://jarkthegoat.github.io/smrttech-3cc3-lab-portal-site/

## Routes

- `index.html` - CloudLab-styled starting page and system architecture map
- `labs/lab-01/index.html` - active interactive Lab 1 manual
- `labs/lab-02/index.html` - active interactive Lab 2 temperature sensing manual
- `labs/lab-03/index.html` - active interactive Lab 3 tilt detection manual
- `labs/lab-04/index.html` - active interactive Lab 4 load cell and signal amplification manual
- `labs/lab-05/index.html` - active interactive Lab 5 servo motor control manual
- `labs/lab-06/index.html` - active interactive Lab 6 stepper motor and serial communication manual
- `labs/lab-07/index.html` - active interactive Lab 7 ThingsBoard ultrasonic sensing and remote LED-control manual
- `labs/lab-08/index.html` - active interactive Lab 8 ThingsBoard soil-moisture monitoring manual
- `project/index.html` - active 3CC3 design project manual for the final smart-system prototype
- `labs/lab-09/index.html` - blank lab manual space retained for future course content
- `knowledge/index.html` - searchable shared knowledge database
- `knowledge/skill-tree.html` - radial skill-tree graphic embedded from the knowledge database
- `knowledge/curriculum.json` - data source for the radial skill tree
- `knowledge/curriculum-data.js` - local-file fallback copy of the skill-tree curriculum
- `assets/` - shared McMaster logo and lab imagery

## Architecture

The course hub is the entry point. Lab pages carry interactive staged work. The knowledge database stores reusable concepts that can be linked from any lab. Shared assets keep visual language and instructional media consistent.

The design is static-site friendly and can be hosted on a school server, GitHub Pages, or inside an LMS content area. Student entries remain local to the browser unless a later approved LMS or LTI integration is added.
