# Roadie

Roadie is a digital band manager that was (and still is) being designed to handle
tasks for someone in a band or a real-life band manager. Roadie enables a user
to be able to keep track of their to-do list, expenses, and relevant contacts
making the tumultous life of the Music Industry that much easier.

## Technologies
Roadie's front end was built using the front-end framework, Ember. The
back-end was written in Rails.

## Approach

Roadie was built starting with the back-end. The app is built to be ever-changing
based off of user feedback. It was built knowing that all bands have the same things
in common: they have stuff to do, money to spend, and people to remember. These
first three models were all built right away along with their owner, the band
itself. Roadie was also built knowing that anyone in the industry likely has
their hands in multiple jars, so multiple bands can be added and each owns its
own items. Building this back-end enables roadie to grow as well as made outlining
the front that much easier.

The front end was originally built with the mindset of 'just make it work'. Once
it did everything it had to, it came to refactoring. While the user owned their
bands, a band did not own any content. The code was refactored to assign this
ownership. Having set this up along with an intermediary page between a band
and their tasks, expenses, etc., further enables Roadie to grow bigger.

## User Stories

1.  A user can create a band
2.  A user can easily maintain and update that band
3.  A user can go to a band and have ownership of various items
  - items are thing a band owns, like expenses or tasks
4. A user can create, update, view, and delete each of its item
5. A user can easily navigate between their bands, and their items

## Links

* [Front-End Site] (https://akradin.github.io/front-end-roadie/)
* [Back-End Repository] (https://github.com/akradin/back-end-roadie)
* Wireframes (see images folder)
* Screen shot of Site (see images folder)


## Challenges

The most difficult part of building roadie was enabling a band to have ownership
of its individual items. After quite a bit of changing code, colleagues assisted
in assinging this ownership.


## [MIT License](https://opensource.org/licenses/MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
