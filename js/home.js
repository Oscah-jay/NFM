(() => {
  "use strict";

  const toggleButton = document.querySelector(".navbar-toggle");
  const navigationMenu = document.querySelector(".navbar-menu");
  const navigationLinks = document.querySelectorAll(".navbar-menu a");
  const pageSections = document.querySelectorAll("main section[id]");
  const causeCarousel = document.querySelector(".causes-carousel");
  const causeCards = Array.from(document.querySelectorAll(".cause-card"));
  const causeControls = document.querySelectorAll(".causes-nav button");

  const setMenuState = (isOpen) => {
    if (!toggleButton || !navigationMenu) {
      return;
    }

    navigationMenu.classList.toggle("is-open", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    toggleButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  toggleButton?.addEventListener("click", () => {
    const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!navigationMenu || !toggleButton) {
      return;
    }

    const clickedInsideNavigation = navigationMenu.contains(event.target);
    const clickedToggle = toggleButton.contains(event.target);

    if (!clickedInsideNavigation && !clickedToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggleButton?.focus();
    }
  });

  const updateActiveNavigationLink = () => {
    const currentPosition = window.scrollY + 160;
    let activeSectionId = "top";

    pageSections.forEach((section) => {
      if (currentPosition >= section.offsetTop) {
        activeSectionId = section.id;
      }
    });

    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeSectionId}`;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  let scrollFrame;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) {
        return;
      }

      scrollFrame = window.requestAnimationFrame(() => {
        updateActiveNavigationLink();
        scrollFrame = null;
      });
    },
    { passive: true }
  );

  updateActiveNavigationLink();

  const updateCauseOrder = (direction) => {
    if (!causeCarousel || causeCards.length < 2) {
      return;
    }

    const currentOrders = causeCards.map((card) => Number(card.dataset.order || 0));
    const nextOrders = currentOrders.map((order) => {
      return (order - direction + causeCards.length) % causeCards.length;
    });

    causeCards.forEach((card, index) => {
      card.dataset.order = String(nextOrders[index]);
      card.style.order = String(nextOrders[index]);
    });
  };

  causeCards.forEach((card, index) => {
    card.dataset.order = String(index);
    card.style.order = String(index);
  });

  causeControls.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.direction || 0);
      updateCauseOrder(direction);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", targetId);
    });
  });
})();

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    const menu = document.querySelector(".navbar-menu");
    const toggle = document.querySelector(".navbar-toggle");

    menu?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
  }
});

window.addEventListener("load", () => {
  document.documentElement.classList.add("page-ready");
});
