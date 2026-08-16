---
title: Rasam House - Comfort Food Landing Page
published: false
description: A warm, responsive landing page for a South Indian rasam rice concept.
tags: devchallenge, frontendchallenge, css, javascript
---

## What I Built

I built **Rasam House**, a polished landing page for an imaginary comfort-food
spot centered around South Indian rasam rice. I wanted the page to feel like the
meal itself: warm, clear, unfussy, and quietly comforting.

For me, rasam rice is the food equivalent of someone lowering the volume on a
hard day. Before the bowl even reaches the table, the kitchen tells you what is
coming: mustard seeds crackling, curry leaves hitting hot ghee, pepper and
tamarind rising with the steam. It is simple food: rice, tomato, tamarind,
pepper, cumin, curry leaves, and a little ghee. But when it is hot and bright
and spooned into a bowl, it feels like being brought back to yourself. That is
the feeling I tried to turn into a landing page.

The page includes:

- a full-viewport food hero with soft steam animation
- a short cooking loader with a simmering pot animation
- accessible navigation and skip link
- menu cards
- a short cooking ritual section
- an interactive "build your bowl" order panel
- responsive mobile layout
- reduced-motion support

## Demo

{% embed https://rohithmatham12.github.io/dev-comfort-food-challenge/ %}

Source code:
https://github.com/Rohithmatham12/dev-comfort-food-challenge

## Journey

The main design challenge was making the food feel present immediately without
turning the page into a generic restaurant template. I kept the layout simple
and let the dish lead the first screen. The interaction is intentionally small:
users can choose a bowl, spice level, and garnish, and the order summary updates
without needing a backend.

I also added a gentle steam animation in the hero, a little "Simmering rasam"
loader, and a tiny confirmation moment after reserving pickup. The motion is
intentionally quiet because comfort food should not feel like a slot machine. It
should feel like something is patiently getting warm for you.

I focused on frontend fundamentals:

- semantic sections and form labels
- visible focus states
- readable color contrast
- responsive grid changes
- no layout overlap on narrow screens
- lightweight JavaScript
- reduced-motion support for the animated parts

## Accessibility Notes

I included a skip link, semantic landmarks, a named navigation region, labeled
form controls, visible focus states, and an `aria-live` order summary so changes
are announced politely. The mobile menu button updates `aria-expanded`, and the
page avoids relying on animation for core understanding.

## Built With

- HTML
- CSS
- JavaScript

## Screenshots

Desktop:

![Rasam House desktop screenshot](https://rohithmatham12.github.io/dev-comfort-food-challenge/assets/screenshot-desktop.png)

Mobile:

![Rasam House mobile screenshot](https://rohithmatham12.github.io/dev-comfort-food-challenge/assets/screenshot-mobile.png)
