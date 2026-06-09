/*
 * Penny's Patchwork Portfolio — slide data + deck behavior
 * Each photo slide carries TWO layers of text:
 *   - alt:  concise, literal description for screen readers
 *   - blurb: the playful, detailed "fun" caption shown on screen
 */

const SLIDES = [
  {
    type: "title",
    title: "Penny's Patchwork Portfolio",
    subtitle: "Six fine portraits of one extremely good Cavalier · est. furever",
  },
  {
    src: "IMG_5519.jpeg",
    orient: "portrait",
    title: "The Tableside Gaze",
    alt: "Black-and-tan Cavalier King Charles Spaniel standing on a sunlit hardwood floor beside a table leg, looking up at the camera with big round eyes.",
    blurb:
      "The official “I have not been fed in approximately four hundred years” face. Penny posts up beside the table leg, locks on with those enormous melted-chocolate eyes, and waits for someone — anyone — to crack. A sunbeam stripes the floorboards just to make her case more sympathetic. Spoiler: she had breakfast twenty minutes ago.",
  },
  {
    src: "IMG_0353.jpg",
    orient: "landscape",
    title: "The Velvet Loaf",
    alt: "The Cavalier lying on a navy-blue velvet tufted sofa with her front legs stretched forward and tan feathering on her legs, looking at the camera.",
    blurb:
      "Behold: the loaf at rest. Penny has claimed the navy velvet sofa as her personal chaise lounge, front paws elegantly extended, leg feathers fanned out like she is posing for a Renaissance oil painting. The channel-tufted backdrop was clearly chosen to complement her coat. Do not disturb the queen.",
  },
  {
    src: "IMG_5538.jpg",
    orient: "portrait",
    title: "Deep Thoughts",
    alt: "Close-up of the Cavalier in a living room, turned to one side with a thoughtful expression; a tan leather sofa and a patterned rug sit behind her.",
    blurb:
      "Penny gazes wistfully into the middle distance, contemplating life’s great mysteries: is the mailman friend or foe? Where does the red dot go when the lights turn off? Her wavy ears catch the afternoon light while a tan leather sofa sets the mood. A single rogue eyebrow whisker stands straight up, because even philosophers have bedhead.",
  },
  {
    src: "IMG_3003.jpg",
    orient: "portrait",
    title: "Golden Hour, Unplugged",
    alt: "The Cavalier sitting upright on a navy sofa, dramatically lit by a glowing round lamp held in the foreground, with window blinds behind her.",
    blurb:
      "Storytime by the campfire — except the campfire is a tiny glowing lamp and the story is about treats. Penny holds perfectly still inside the golden halo, leg feathering lit up like spun copper, radiating maximum main-character energy. It’s giving album cover. It’s giving acoustic session. It’s giving certified very good girl.",
  },
  {
    src: "IMG_8848.jpg",
    orient: "portrait",
    title: "The Bath Burrito",
    alt: "Black-and-tan Cavalier King Charles Spaniel wrapped snugly in a tan towel, sitting in a grey donut bed against dark floral wallpaper.",
    blurb:
      "Fresh out of the tub and absolutely not amused about it. Penny has been swaddled into a flawless bath burrito, ears slicked into glamorous ringlets, side-eyeing the towel like it personally wronged her. The Strawberry Thief wallpaper behind her completes the full “damp Victorian aristocrat awaiting an apology” aesthetic.",
  },
  {
    src: "IMG_1706.jpg",
    orient: "portrait",
    title: "Resting Her Eyes",
    alt: "The Cavalier dozing on a grey knit blanket with eyes half-closed, an orange carrot toy and a green tassel-rope toy resting in front of her.",
    blurb:
      "Nap protested, nap lost. Penny is one slow blink from full shutdown, chin parked on a cozy knit blanket with her two prized possessions — a plush carrot and a green tassel guy — standing guard. She is not asleep, she is “resting her eyes,” and she will have you know she could spring into action at any moment. (She will not.)",
  },
];

/* ---------- deck behavior ---------- */
(function () {
  const deck = document.getElementById("deck");
  const dotsWrap = document.getElementById("dots");
  const counter = document.getElementById("counter");
  const liveRegion = document.getElementById("live");
  let index = 0;

  // Build slides
  SLIDES.forEach((s, i) => {
    const slide = document.createElement("section");
    slide.className = "slide patch" + (s.type === "title" ? " slide--title" : "");
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${i + 1} of ${SLIDES.length}`);
    slide.id = "slide-" + i;

    if (s.type === "title") {
      slide.innerHTML = `
        <h1 class="title-main">${s.title}</h1>
        <p class="title-sub">${s.subtitle}</p>
        <p class="title-hint">Use the arrows, the dots, your keyboard ← →, or swipe.</p>
        <p class="title-paw" aria-hidden="true">\u{1F43E}</p>`;
    } else {
      slide.innerHTML = `
        <figure class="frame frame--${s.orient}">
          <div class="photo-mat">
            <img class="photo" src="${s.src}" alt="${s.alt}" loading="lazy" decoding="async">
          </div>
          <figcaption class="caption">
            <h2 class="caption-title">${s.title}</h2>
            <p class="caption-blurb">${s.blurb}</p>
          </figcaption>
        </figure>`;
    }
    deck.appendChild(slide);

    // Dot
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dotsWrap.appendChild(dot);
  });

  const slides = Array.from(deck.querySelectorAll(".slide"));
  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

  function render() {
    slides.forEach((sl, i) => {
      const active = i === index;
      sl.classList.toggle("is-active", active);
      sl.hidden = !active;
    });
    dots.forEach((d, i) => {
      const active = i === index;
      d.classList.toggle("is-active", active);
      d.setAttribute("aria-current", active ? "true" : "false");
    });
    counter.textContent = `${index + 1} / ${SLIDES.length}`;
    liveRegion.textContent = `Slide ${index + 1} of ${SLIDES.length}: ${
      SLIDES[index].title
    }`;
  }

  function go(i) {
    index = (i + SLIDES.length) % SLIDES.length;
    render();
  }
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  document.getElementById("next").addEventListener("click", next);
  document.getElementById("prev").addEventListener("click", prev);

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); }
    else if (e.key === "ArrowLeft") { prev(); }
    else if (e.key === "Home") { go(0); }
    else if (e.key === "End") { go(SLIDES.length - 1); }
  });

  // Touch / swipe
  let startX = null;
  deck.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
    startX = null;
  }, { passive: true });

  render();
})();
