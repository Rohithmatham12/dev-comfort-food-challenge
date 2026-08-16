---
title: PawPace - Dog Days Walk Planner
published: false
description: A dog walk safety planner with live weather, Google AI enrichment, and shareable dog report cards.
tags: devchallenge, weekendchallenge, googleai, javascript
cover_image: https://rohithmatham12.github.io/dev-comfort-food-challenge/dog-days/assets/pawpace-cover.png
---

## What I Built

I built **PawPace**, a Dog Days walk planner for people who have ever looked at
the sidewalk in August and wondered, "Is this still a walk, or is this a bad
idea with a leash?"

The app takes a simple dog profile and day profile:

- air temperature
- humidity
- pavement feel
- walk length
- dog size
- short-nosed breed sensitivity
- senior, puppy, or recovering status
- thick or dark coat

Then it turns those signals into a readable walk plan with a caution score,
color-coded heat/paw/hydration risk bars, best time window, paw check guidance,
hydration reminders, and indoor enrichment backup ideas.

The one-line idea: **most dog apps are cute; PawPace tries to prevent actual
vet visits.**

## Demo

{% embed https://rohithmatham12.github.io/dev-comfort-food-challenge/dog-days/ %}

Source code: [GitHub repository](https://github.com/Rohithmatham12/dev-comfort-food-challenge/tree/main/dog-days)

Quick flow:

![PawPace demo showing hero, risk planner, and report card](https://rohithmatham12.github.io/dev-comfort-food-challenge/dog-days/assets/pawpace-demo.gif)

## Why I Built It

Dog safety advice is often scattered across memory, weather apps, and "I think
this pavement is fine" guesses. I wanted to build something small enough for a
weekend challenge but useful enough to imagine opening before an actual walk.

The idea is not to replace care or veterinary advice. It is to make the safer
choice easier in the moment: shorten the route, move the walk later, check the
pavement, carry water, or swap the walk for enrichment when the day is too hot.

## Real Weather Grounding

The app can use **Open-Meteo** to pull live local temperature, humidity, and UV
index from a city name. There is no API key required for this part.

Users can still adjust the sliders manually, but the live weather button keeps
the planner from being only vibes. The score is grounded in actual conditions
when the user wants that.

## Google AI Mode

PawPace works fully without an API key using a rule-based planner.

I also added optional **Google AI mode** for the prize category. If a user
pastes a Google AI Studio API key, PawPace sends the current dog/weather profile
to Gemini and asks for a concise custom indoor enrichment plan. The key is not
stored; it is only used in the browser session when the button is pressed.

This keeps the core app usable for everyone while still making Google AI a
meaningful enhancement instead of a required dependency.

There is also a **Walk Report Card** mode. It uses the same dog/weather profile
to generate a short first-person note from the dog's perspective, such as:

> Today was a 6/10 walk day, buddy. Pavement felt spicy at 2pm, so let's go
> after sunset. Also, I want a puzzle toy.

The report card can be downloaded as an image, so the playful part is shareable
without taking away from the safety utility.

## Screenshots

Desktop:

![PawPace desktop screenshot](https://rohithmatham12.github.io/dev-comfort-food-challenge/dog-days/assets/pawpace-cover.png)

Planner:

![PawPace planner screenshot](https://rohithmatham12.github.io/dev-comfort-food-challenge/dog-days/assets/pawpace-planner.png)

Report card:

![PawPace report card screenshot](https://rohithmatham12.github.io/dev-comfort-food-challenge/dog-days/assets/pawpace-report-card.png)

Mobile:

![PawPace mobile screenshot](https://rohithmatham12.github.io/dev-comfort-food-challenge/dog-days/assets/pawpace-mobile.png)

## Technical Details

- Vanilla HTML, CSS, and JavaScript
- CSS dog illustration, sun meter, leash, shade, and water bowl
- Open-Meteo geocoding and current weather lookup
- rule-based scoring model for walk caution, paw risk, and hydration need
- color-coded visual risk meter and risk breakdown bars
- accessible form labels, fieldsets, live result region, and `role="meter"`
- copyable walk plan
- optional Google Generative Language API calls for enrichment and report cards
- downloadable report-card image via canvas
- responsive layout and `prefers-reduced-motion` support

## What I Am Proud Of

The project tries to answer the challenge theme with something both playful and
practical. It is about dogs, but it is also about the tiny responsibility of
changing the plan when the day is not safe for them.

The source is MIT licensed.
