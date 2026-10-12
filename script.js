/* ========================================================
       PRICELUX ENGINE: SECURE, DEFENSIVE PRODUCTION SCRIPT
       ======================================================== */

const PRICING_DATA = {
  basic: {
    name: "Basic Plan",
    desc: "Essential tools for solo developers, founders, and small exploratory projects.",
    monthly: { USD: 19, EUR: 18, GBP: 15, INR: 12000 },
    annual: { USD: 15, EUR: 14, GBP: 12, INR: 10000 },
  },
  standard: {
    name: "Pro Plan",
    desc: "The sweet spot for growing teams requiring collaborative workflows and speed.",
    monthly: { USD: 49, EUR: 46, GBP: 39, INR: 22000 },
    annual: { USD: 39, EUR: 36, GBP: 31, INR: 18000 },
  },
  premium: {
    name: "Premium Plan",
    desc: "Maximum scale, custom telemetry, SLA guarantees, and dedicated infrastructure.",
    monthly: { USD: 99, EUR: 92, GBP: 79, INR: 42000 },
    annual: { USD: 79, EUR: 74, GBP: 62, INR: 35000 },
  },
  ai: {
    name: "AI Concierge Plan",
    desc: "Autonomous AI agents, real-time code copilot, and benchmark engines.",
    monthly: { USD: 59, EUR: 55, GBP: 47, INR: 29000 },
    annual: { USD: 49, EUR: 45, GBP: 39, INR: 24000 },
  },
  enterprise: {
    name: "Enterprise VPC",
    desc: "Dedicated solutions architect, SOC2 compliance, and enterprise SLAs.",
    monthly: { USD: 189, EUR: 175, GBP: 150, INR: 90000 },
    annual: { USD: 149, EUR: 139, GBP: 119, INR: 75000 },
  },
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

let currentCadence = "annual";
let currentCurrency = "USD";
let selectedTier = "standard";
let recommendedTier = "standard";

let audioCtx = null;
function playHapticTone(
  freq = 520,
  type = "sine",
  duration = 0.08,
  vol = 0.03,
) {
  try {
    if (!audioCtx)
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      freq * 0.4,
      audioCtx.currentTime + duration,
    );

    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioCtx.currentTime + duration,
    );

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playChordSuccess() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
    setTimeout(() => playHapticTone(freq, "sine", 0.22, 0.04), idx * 45);
  });
}

function showToast(msg) {
  const toast = document.getElementById("toastBanner");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "🌓" : "☀️";
  }
  try {
    localStorage.setItem("pricelux-theme", theme);
  } catch (e) {}
}

function updatePricingDisplay() {
  const symbol = CURRENCY_SYMBOLS[currentCurrency] || "$";
  document
    .querySelectorAll("[data-curr-symbol]")
    .forEach((el) => (el.textContent = symbol));

  ["basic", "standard", "premium", "ai", "enterprise"].forEach((tier) => {
    const card = document.getElementById(`card-${tier}`);
    if (!card) return;

    const priceEl = card.querySelector("[data-price-value]");
    const noteEl = card.querySelector("[data-billing-note]");
    const tierData = PRICING_DATA[tier];
    if (!tierData || !tierData[currentCadence]) return;
    const targetPrice = tierData[currentCadence][currentCurrency];
    if (targetPrice === undefined) return;

    if (priceEl) priceEl.textContent = Number(targetPrice).toLocaleString();

    if (noteEl) {
      if (currentCadence === "annual") {
        const annualTotal = (targetPrice * 12).toLocaleString();
        if (tier === "standard") {
          noteEl.textContent = `Billed annually (${symbol}${annualTotal}/yr) • 2 Mo Free`;
        } else {
          noteEl.textContent = `Billed annually (${symbol}${annualTotal}/yr)`;
        }
      } else {
        noteEl.textContent = "Billed month-to-month, cancel anytime";
      }
    }
  });

  updateSmartRecommendation();
}

function updateSmartRecommendation() {
  const qTeam = document.getElementById("qTeamSize");
  const qTraffic = document.getElementById("qTraffic");
  const qPriority = document.getElementById("qPriority");
  const qSupport = document.getElementById("qSupport");

  const recPlanName = document.getElementById("recPlanName");
  const recRationale = document.getElementById("recRationale");

  if (
    !qTeam ||
    !qTraffic ||
    !qPriority ||
    !qSupport ||
    !recPlanName ||
    !recRationale
  )
    return;

  const team = qTeam.value;
  const traffic = qTraffic.value;
  const priority = qPriority.value;
  const support = qSupport.value;

  const symbol = CURRENCY_SYMBOLS[currentCurrency] || "$";

  if (
    team === "enterprise" ||
    traffic === "high" ||
    priority === "compliance" ||
    support === "dedicated"
  ) {
    recommendedTier = "premium";
    recPlanName.textContent = `Premium Plan (${symbol}${PRICING_DATA.premium[currentCadence][currentCurrency]}/mo)`;
    recRationale.textContent =
      "Because you require enterprise-grade scalability, dedicated infrastructure, compliance (SAML SSO), or dedicated architect support.";
  } else if (
    team === "solo" &&
    traffic === "low" &&
    priority === "budget" &&
    support === "community"
  ) {
    recommendedTier = "basic";
    recPlanName.textContent = `Basic Plan (${symbol}${PRICING_DATA.basic[currentCadence][currentCurrency]}/mo)`;
    recRationale.textContent =
      "Because you are operating as an individual developer or solo project with manageable API traffic and community-guided support.";
  } else {
    recommendedTier = "standard";
    recPlanName.textContent = `Standard Plan (${symbol}${PRICING_DATA.standard[currentCadence][currentCurrency]}/mo)`;
    recRationale.textContent =
      "Because you have a growing collaborative team requiring custom domains, automated daily backups, and priority 24/7 support without enterprise overhead.";
  }
}

// Comprehensive Event Wiring Routine
function initPricelux() {
  // Initialize Lenis Smooth Scroll
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.lenis = lenis;

    // Smooth scroll for internal navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId && targetId !== "#") {
          const targetElem = document.querySelector(targetId);
          if (targetElem) {
            e.preventDefault();
            lenis.scrollTo(targetElem, { offset: -70, duration: 1.2 });
          }
        }
      });
    });
  }

  // Smart Navigation Header: Hide on scroll down, Reveal on scroll up
  const siteHeader = document.getElementById("siteHeader");
  if (siteHeader) {
    let lastScrollY = window.scrollY || 0;
    const scrollThreshold = 8;

    const onScrollChange = (currentScrollY) => {
      const scrollDiff = currentScrollY - lastScrollY;

      if (currentScrollY > 80) {
        siteHeader.classList.add("header-scrolled");

        // Scrolling down -> hide navbar
        if (scrollDiff > scrollThreshold) {
          siteHeader.classList.add("header-hidden");
        } 
        // Scrolling up -> reveal navbar
        else if (scrollDiff < -scrollThreshold) {
          siteHeader.classList.remove("header-hidden");
        }
      } else {
        // At the top of the page -> keep visible
        siteHeader.classList.remove("header-hidden");
        siteHeader.classList.remove("header-scrolled");
      }

      lastScrollY = Math.max(0, currentScrollY);
    };

    if (window.lenis) {
      window.lenis.on("scroll", ({ scroll }) => {
        onScrollChange(scroll);
      });
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!window.lenis) {
          onScrollChange(window.scrollY);
        }
      },
      { passive: true },
    );
  }

  // 1. Initial theme hydration
  let savedTheme = "dark";
  try {
    savedTheme =
      localStorage.getItem("pricelux-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
  } catch (e) {}
  applyTheme(savedTheme);

  // Theme toggle listener
  const btnThemeToggle = document.getElementById("btnThemeToggle");
  btnThemeToggle?.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    const target = current === "dark" ? "light" : "dark";
    applyTheme(target);
    playHapticTone(target === "dark" ? 380 : 720, "sine", 0.08, 0.04);
    showToast(`Switched to ${target.toUpperCase()} mode`);
  });

  // 2. Billing Cadence listeners
  const btnMonthly = document.getElementById("btnCadenceMonthly");
  const btnAnnual = document.getElementById("btnCadenceAnnual");

  btnMonthly?.addEventListener("click", () => {
    currentCadence = "monthly";
    btnMonthly.classList.add("active");
    btnMonthly.setAttribute("aria-checked", "true");
    btnAnnual?.classList.remove("active");
    btnAnnual?.setAttribute("aria-checked", "false");
    updatePricingDisplay();
    playHapticTone(460, "sine", 0.08, 0.03);
    showToast("Cadence: Flexible Month-to-Month");
  });

  btnAnnual?.addEventListener("click", () => {
    currentCadence = "annual";
    btnAnnual.classList.add("active");
    btnAnnual.setAttribute("aria-checked", "true");
    btnMonthly?.classList.remove("active");
    btnMonthly?.setAttribute("aria-checked", "false");
    updatePricingDisplay();
    playChordSuccess();
    showToast("20% Annual Savings Activated! ✨");
  });

  // 3. Currency listener
  const currencySelect = document.getElementById("currencySelect");
  currencySelect?.addEventListener("change", (e) => {
    currentCurrency = e.target.value;
    updatePricingDisplay();
    playHapticTone(580, "sine", 0.06, 0.03);
    showToast(
      `Currency: ${currentCurrency} (${CURRENCY_SYMBOLS[currentCurrency]})`,
    );
  });

  // 4. Form question listeners
  ["qTeamSize", "qTraffic", "qPriority", "qSupport"].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener("change", () => {
      updateSmartRecommendation();
      playHapticTone(640, "triangle", 0.06, 0.03);
    });
  });

  // 5. Highlight plan button
  const btnHighlightPlan = document.getElementById("btnHighlightPlan");
  btnHighlightPlan?.addEventListener("click", () => {
    const targetCard = document.getElementById(`card-${recommendedTier}`);
    if (targetCard) {
      if (typeof window.rotateCarouselToCard === "function") {
        window.rotateCarouselToCard(targetCard);
      }
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      targetCard.style.outline = "3px solid var(--color-cyan-glow, #00F0FF)";
      setTimeout(() => (targetCard.style.outline = "none"), 2000);
      playChordSuccess();
      showToast(`Highlighted: ${PRICING_DATA[recommendedTier].name} ✨`);
    }
  });

  // 6. Show Differences filter
  const chkDiffOnly = document.getElementById("chkDiffOnly");
  chkDiffOnly?.addEventListener("change", (e) => {
    const hideSame = e.target.checked;
    document.querySelectorAll(".table-row-same").forEach((row) => {
      row.style.display = hideSame ? "none" : "table-row";
    });
    playHapticTone(520, "sine", 0.05, 0.03);
    showToast(
      hideSame ? "Showing Unique Plan Differences" : "Showing All Features",
    );
  });

  // 7. ROI Slider listener
  const sliderRoiTeam = document.getElementById("sliderRoiTeam");
  const roiTeamDisplay = document.getElementById("roiTeamDisplay");
  const roiSavingsDisplay = document.getElementById("roiSavingsDisplay");
  const roiHoursDisplay = document.getElementById("roiHoursDisplay");

  sliderRoiTeam?.addEventListener("input", (e) => {
    const members = parseInt(e.target.value, 10);
    if (roiTeamDisplay)
      roiTeamDisplay.textContent = `${members} ${members === 1 ? "Engineer" : "Engineers"}`;

    const hoursSaved = members * 48;
    const dollarsSaved = hoursSaved * 50;

    if (roiHoursDisplay)
      roiHoursDisplay.textContent = `${hoursSaved} dev hours`;
    if (roiSavingsDisplay)
      roiSavingsDisplay.textContent = `$${dollarsSaved.toLocaleString()}`;
  });

  // 8. FAQ Accordion listeners
  const faqButtons = document.querySelectorAll(".faq-trigger-btn");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isExp = btn.getAttribute("aria-expanded") === "true";
      const currentCard = btn.closest(".faq-card-item");

      // Close other open FAQ items for clean accordion UX
      faqButtons.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          otherBtn.closest(".faq-card-item")?.classList.remove("is-open");
        }
      });

      btn.setAttribute("aria-expanded", !isExp);
      currentCard?.classList.toggle("is-open", !isExp);
      playHapticTone(!isExp ? 620 : 440, "sine", 0.05, 0.02);
    });
  });

  // 9. Checkout modal listeners
  const checkoutModal = document.getElementById("checkoutModal");
  const modalPlanTitle = document.getElementById("modalPlanTitle");
  const modalReceiptPlan = document.getElementById("modalReceiptPlan");
  const modalReceiptCadence = document.getElementById("modalReceiptCadence");
  const modalReceiptPrice = document.getElementById("modalReceiptPrice");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const btnConfirmActivation = document.getElementById("btnConfirmActivation");

  document.querySelectorAll("[data-select-plan]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedTier = btn.getAttribute("data-select-plan");
      const plan = PRICING_DATA[selectedTier];
      const symbol = CURRENCY_SYMBOLS[currentCurrency] || "$";

      if (modalPlanTitle) modalPlanTitle.textContent = `Deploy ${plan.name}`;
      if (modalReceiptPlan) modalReceiptPlan.textContent = plan.name;
      if (modalReceiptCadence)
        modalReceiptCadence.textContent =
          currentCadence === "annual"
            ? "Annual Privilege (-20%)"
            : "Monthly Flexible";
      if (modalReceiptPrice)
        modalReceiptPrice.textContent = `${symbol}0.00 (14-Day Free Trial)`;

      checkoutModal?.classList.add("open");
      playChordSuccess();
    });
  });

  function closeModal() {
    checkoutModal?.classList.remove("open");
  }
  btnCloseModal?.addEventListener("click", closeModal);
  checkoutModal?.addEventListener("click", (e) => {
    if (e.target === checkoutModal) closeModal();
  });

  btnConfirmActivation?.addEventListener("click", () => {
    closeModal();
    playChordSuccess();
    showToast(`Workspace Created for ${PRICING_DATA[selectedTier].name}! 🚀`);
  });

  // Demo Tour Modal listeners
  const demoModal = document.getElementById("demoModal");
  const btnHeroWatchDemo = document.getElementById("btnHeroWatchDemo");
  const btnCloseDemoModal = document.getElementById("btnCloseDemoModal");
  const btnDemoExplorePlans = document.getElementById("btnDemoExplorePlans");

  function openDemoModal() {
    demoModal?.classList.add("open");
    playChordSuccess();
  }
  function closeDemoModal() {
    demoModal?.classList.remove("open");
  }

  btnHeroWatchDemo?.addEventListener("click", openDemoModal);
  btnCloseDemoModal?.addEventListener("click", closeDemoModal);
  demoModal?.addEventListener("click", (e) => {
    if (e.target === demoModal) closeDemoModal();
  });
  btnDemoExplorePlans?.addEventListener("click", () => {
    closeDemoModal();
    document.getElementById("pricingSection")?.scrollIntoView({ behavior: "smooth" });
  });

  // 10. Mobile Menu listeners
  const btnMobileMenu = document.getElementById("btnMobileMenu");
  const mobileDrawer = document.getElementById("mobileDrawer");
  btnMobileMenu?.addEventListener("click", () => {
    if (!mobileDrawer) return;
    const isOpen = mobileDrawer.classList.toggle("open");
    btnMobileMenu.setAttribute("aria-expanded", isOpen);
    mobileDrawer.setAttribute("aria-hidden", !isOpen);
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileDrawer?.classList.remove("open");
      btnMobileMenu?.setAttribute("aria-expanded", "false");
      mobileDrawer?.setAttribute("aria-hidden", "true");
    });
  });

  // 11. Miscellaneous listeners
  document
    .getElementById("btnDismissAnnouncement")
    ?.addEventListener("click", () => {
      const bar = document.getElementById("announcementBar");
      if (bar) bar.style.display = "none";
    });

  document.getElementById("btnBackToTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const copyrightYear = document.getElementById("copyrightYear");
  if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

  // Initial pricing rendering
  updatePricingDisplay();

  // 12. Setup Gemini AI Workload Analyzer
  setupGeminiFeatures();
}

// Gemini LLM Integration
function setupGeminiFeatures() {
  const apiKey = ""; // Canvas runtime supplies the API key when left blank
  const aiWorkloadInput = document.getElementById("aiWorkloadInput");
  const btnRunAiAnalysis = document.getElementById("btnRunAiAnalysis");
  const aiBtnText = document.getElementById("aiBtnText");
  const aiBtnIcon = document.getElementById("aiBtnIcon");
  const recConfidenceBadge = document.getElementById("recConfidenceBadge");

  const PRICELUX_SPECIFICATION = `
      PRICELUX Tiers and Quotas:
      1. Basic Plan: $15/mo billed annually ($19/mo monthly). Max 1 Seat (Solo). 10,000 monthly API requests. 3 Active Workspaces. Global Edge CDN. Community forum support. No custom domains, no team collaboration, no SAML SSO.
      2. Standard Plan (Recommended / Most Popular): $39/mo billed annually ($49/mo monthly). Up to 15 Team Members. 250,000 monthly API requests. Unlimited Workspaces. Custom domains with automatic SSL. Automated daily cloud backups. 24/7 priority chat & email concierge. No SAML SSO or 99.99% SLA.
      3. Premium Plan (Enterprise): $79/mo billed annually ($99/mo monthly). Unlimited Seats & Workspaces. Unlimited API requests (dedicated cluster). SAML SSO, SCIM & audit logs. 99.99% financially backed SLA. Dedicated solutions architect direct line. Real-time continuous backups.
      `;

  async function analyzeWorkloadWithGemini(userPrompt) {
    if (!userPrompt || !userPrompt.trim()) {
      showToast("Please enter your team or workload specifications.");
      return;
    }

    if (aiBtnText) aiBtnText.textContent = "Analyzing Stack...";
    if (aiBtnIcon) aiBtnIcon.innerHTML = `<span class="ai-spinner"></span>`;
    if (btnRunAiAnalysis) btnRunAiAnalysis.disabled = true;
    playHapticTone(600, "sine", 0.08, 0.04);

    const systemPrompt = `You are the Principal Solutions Architect for PRICELUX. Analyze the user's workload specifications against the following official PRICELUX tiers:
        ${PRICELUX_SPECIFICATION}

        Respond strictly in JSON format matching this schema:
        {
          "recommendedTier": "basic" | "standard" | "premium",
          "planDisplayName": string,
          "matchPercentage": number,
          "rationale": string (2-3 concise sentences explaining why this tier is optimal and how it avoids over-provisioning or bottlenecks),
          "scalingAdvice": string (1 brief sentence on when they would need to upgrade)
        }`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze this user's workload and recommend the ideal PRICELUX plan: "${userPrompt}"`,
            },
          ],
        },
      ],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            recommendedTier: {
              type: "STRING",
              enum: ["basic", "standard", "premium"],
            },
            planDisplayName: { type: "STRING" },
            matchPercentage: { type: "NUMBER" },
            rationale: { type: "STRING" },
            scalingAdvice: { type: "STRING" },
          },
          required: [
            "recommendedTier",
            "planDisplayName",
            "matchPercentage",
            "rationale",
          ],
        },
      },
    };

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API call error");
      const result = await response.json();
      const candidate = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (candidate) {
        const parsed = JSON.parse(candidate);
        recommendedTier = parsed.recommendedTier.toLowerCase();

        const symbol = CURRENCY_SYMBOLS[currentCurrency] || "$";
        const price =
          PRICING_DATA[recommendedTier][currentCadence][currentCurrency];

        const recPlanName = document.getElementById("recPlanName");
        const recRationale = document.getElementById("recRationale");

        if (recPlanName)
          recPlanName.textContent = `${parsed.planDisplayName || PRICING_DATA[recommendedTier].name} (${symbol}${price}/mo)`;
        if (recRationale)
          recRationale.textContent = `${parsed.rationale} ${parsed.scalingAdvice ? "• " + parsed.scalingAdvice : ""}`;
        if (recConfidenceBadge)
          recConfidenceBadge.textContent = `${parsed.matchPercentage || 95}% Workload Fit`;

        playChordSuccess();
        showToast(
          `Gemini recommends: ${PRICING_DATA[recommendedTier].name} ✨`,
        );
      }
    } catch (err) {
      updateSmartRecommendation();
      if (recConfidenceBadge)
        recConfidenceBadge.textContent = "Synthesized Match";
      showToast("Synthesized Plan recommendation loaded.");
    } finally {
      if (aiBtnText) aiBtnText.textContent = "Analyze with Gemini";
      if (aiBtnIcon) aiBtnIcon.textContent = "✨";
      if (btnRunAiAnalysis) btnRunAiAnalysis.disabled = false;
    }
  }

  btnRunAiAnalysis?.addEventListener("click", () => {
    if (aiWorkloadInput) analyzeWorkloadWithGemini(aiWorkloadInput.value);
  });

  document.querySelectorAll(".scenario-chip[data-scenario]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const scenario = chip.getAttribute("data-scenario");
      if (aiWorkloadInput && scenario) {
        aiWorkloadInput.value = scenario;
        analyzeWorkloadWithGemini(scenario);
      }
    });
  });

  // Toggle views (Gemini AI vs Quick Form)
  const btnModeAi = document.getElementById("btnModeAi");
  const btnModeRules = document.getElementById("btnModeRules");
  const aiAnalyzerView = document.getElementById("aiAnalyzerView");
  const rulesAnalyzerView = document.getElementById("rulesAnalyzerView");

  btnModeAi?.addEventListener("click", () => {
    btnModeAi.classList.add("active");
    btnModeAi.setAttribute("aria-selected", "true");
    btnModeRules?.classList.remove("active");
    btnModeRules?.setAttribute("aria-selected", "false");
    if (aiAnalyzerView) aiAnalyzerView.style.display = "block";
    if (rulesAnalyzerView) rulesAnalyzerView.style.display = "none";
    playHapticTone(580, "sine", 0.06, 0.03);
  });

  btnModeRules?.addEventListener("click", () => {
    btnModeRules.classList.add("active");
    btnModeRules.setAttribute("aria-selected", "true");
    btnModeAi?.classList.remove("active");
    btnModeAi?.setAttribute("aria-selected", "false");
    if (rulesAnalyzerView) rulesAnalyzerView.style.display = "grid";
    if (aiAnalyzerView) aiAnalyzerView.style.display = "none";
    updateSmartRecommendation();
    playHapticTone(520, "sine", 0.06, 0.03);
  });

  // Concierge drawer
  const aiConciergeDrawer = document.getElementById("aiConciergeDrawer");
  const fabOpenConcierge = document.getElementById("fabOpenConcierge");
  const btnOpenAiConcierge = document.getElementById("btnOpenAiConcierge");
  const btnCloseConcierge = document.getElementById("btnCloseConcierge");
  const aiChatHistory = document.getElementById("aiChatHistory");
  const aiChatForm = document.getElementById("aiChatForm");
  const aiChatInput = document.getElementById("aiChatInput");

  function openConcierge() {
    aiConciergeDrawer?.classList.add("open");
    window.lenis?.stop();
    playHapticTone(640, "sine", 0.08, 0.04);
    aiChatInput?.focus();
  }

  function closeConcierge() {
    aiConciergeDrawer?.classList.remove("open");
    window.lenis?.start();
  }

  fabOpenConcierge?.addEventListener("click", openConcierge);
  btnOpenAiConcierge?.addEventListener("click", openConcierge);
  btnCloseConcierge?.addEventListener("click", closeConcierge);
  aiConciergeDrawer?.addEventListener("click", (e) => {
    if (e.target === aiConciergeDrawer) closeConcierge();
  });

  // Silky Smooth Lerp Wheel Scroll for Chat History
  let chatScrollTarget = null;
  let isChatRafRunning = false;

  function renderChatSmoothScroll() {
    if (!aiChatHistory || chatScrollTarget === null) {
      isChatRafRunning = false;
      return;
    }
    const current = aiChatHistory.scrollTop;
    const diff = chatScrollTarget - current;
    if (Math.abs(diff) > 0.8) {
      aiChatHistory.scrollTop = current + diff * 0.18;
      requestAnimationFrame(renderChatSmoothScroll);
    } else {
      aiChatHistory.scrollTop = chatScrollTarget;
      chatScrollTarget = null;
      isChatRafRunning = false;
    }
  }

  aiChatHistory?.addEventListener("wheel", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const maxScroll = Math.max(0, aiChatHistory.scrollHeight - aiChatHistory.clientHeight);
    if (chatScrollTarget === null) {
      chatScrollTarget = aiChatHistory.scrollTop;
    }
    chatScrollTarget = Math.max(0, Math.min(maxScroll, chatScrollTarget + e.deltaY * 1.05));
    if (!isChatRafRunning) {
      isChatRafRunning = true;
      requestAnimationFrame(renderChatSmoothScroll);
    }
  }, { passive: false });

  aiChatHistory?.addEventListener("touchmove", (e) => {
    e.stopPropagation();
  }, { passive: true });

  function appendChatMessage(role, content, isHtml = false) {
    if (!aiChatHistory) return null;
    const bubble = document.createElement("div");
    bubble.className = `ai-msg-bubble ${role}`;
    if (isHtml) {
      bubble.innerHTML = content;
    } else {
      bubble.textContent = content;
    }
    aiChatHistory.appendChild(bubble);
    chatScrollTarget = null;
    aiChatHistory.scrollTo({
      top: aiChatHistory.scrollHeight,
      behavior: "smooth",
    });
    return bubble;
  }

  function buildStructuredCardHTML({
    headerEmoji = "✨",
    headerTitle = "PRICELUX Advisory",
    points = [],
    footerEmoji = "💡",
    footerText = "",
  }) {
    const pointsHTML = points
      .map(
        (pt) => `
      <li class="ai-struct-item">
        <span class="ai-item-emoji">${pt.emoji || "✦"}</span>
        <div class="ai-item-body">
          <strong>${pt.title}:</strong> ${pt.desc}
        </div>
      </li>`
      )
      .join("");

    const footerHTML = footerText
      ? `
      <div class="ai-struct-footer">
        <span class="ai-footer-emoji">${footerEmoji}</span>
        <span>${footerText}</span>
      </div>`
      : "";

    return `
      <div class="ai-struct-card">
        <div class="ai-struct-header">
          <span class="ai-badge-icon">${headerEmoji}</span>
          <span>${headerTitle}</span>
        </div>
        <ul class="ai-struct-list">
          ${pointsHTML}
        </ul>
        ${footerHTML}
      </div>`;
  }

  function getStructuredKnowledgeResponse(query) {
    const q = (query || "").toLowerCase();

    if (
      q.includes("sla") ||
      q.includes("99.99") ||
      q.includes("uptime") ||
      q.includes("guarantee") ||
      q.includes("agreement")
    ) {
      return buildStructuredCardHTML({
        headerEmoji: "🛡️",
        headerTitle: "Enterprise 99.99% Uptime SLA",
        points: [
          {
            emoji: "⚖️",
            title: "Legally Backed",
            desc: "The Premium plan includes a contractually binding 99.99% uptime guarantee with credit refunds upon breach.",
          },
          {
            emoji: "⚡",
            title: "15-Min Response",
            desc: "24/7 prioritized engineering support with dedicated Slack & Teams escalation channels.",
          },
          {
            emoji: "🌐",
            title: "Multi-Region Redundancy",
            desc: "Active-active global edge infrastructure with automated failover and zero single point of failure.",
          },
        ],
        footerEmoji: "📜",
        footerText: "Dedicated enterprise SLA addendums are signed during annual onboarding.",
      });
    }

    if (
      q.includes("overage") ||
      q.includes("limit") ||
      q.includes("exceed") ||
      q.includes("quota") ||
      q.includes("burst")
    ) {
      return buildStructuredCardHTML({
        headerEmoji: "⚡",
        headerTitle: "Fair Overage & Quota Policy",
        points: [
          {
            emoji: "🚫",
            title: "Zero Surprise Bills",
            desc: "We never cut off your traffic abruptly or charge surprise penalty rates when usage surges.",
          },
          {
            emoji: "🔔",
            title: "Smart Thresholds",
            desc: "Automated alerts ping your team at 80% & 90% quota thresholds so you stay fully informed.",
          },
          {
            emoji: "📈",
            title: "14-Day Buffer",
            desc: "Enjoy a flexible soft burst allowance with 1-click seamless prorated upgrade options.",
          },
        ],
        footerEmoji: "🛡️",
        footerText: "Downgrade or upgrade anytime with instant prorated billing credits.",
      });
    }

    if (
      q.includes("wire") ||
      q.includes("invoice") ||
      q.includes("tax") ||
      q.includes("vat") ||
      q.includes("gst") ||
      q.includes("eur") ||
      q.includes("usd") ||
      q.includes("gbp") ||
      q.includes("inr") ||
      q.includes("bank") ||
      q.includes("transfer")
    ) {
      return buildStructuredCardHTML({
        headerEmoji: "💳",
        headerTitle: "Invoicing & Wire Payments",
        points: [
          {
            emoji: "📄",
            title: "Official Tax Invoices",
            desc: "Full VAT & GST-compliant enterprise invoices issued automatically for all annual commitments.",
          },
          {
            emoji: "💱",
            title: "Multi-Currency Settlement",
            desc: "Native billing support in USD ($), EUR (€), GBP (£), and INR (₹) with zero conversion fees.",
          },
          {
            emoji: "🏦",
            title: "Direct Wire Rails",
            desc: "SEPA, ACH, NEFT/RTGS, and international wire transfers processed smoothly on Net-30 terms.",
          },
        ],
        footerEmoji: "🎁",
        footerText: "Annual commitments automatically include a 20% discount (2 months free).",
      });
    }

    if (
      q.includes("trial") ||
      q.includes("free") ||
      q.includes("credit card") ||
      q.includes("card") ||
      q.includes("cancel") ||
      q.includes("refund")
    ) {
      return buildStructuredCardHTML({
        headerEmoji: "🚀",
        headerTitle: "14-Day Risk-Free Trial",
        points: [
          {
            emoji: "✨",
            title: "Zero Card Upfront",
            desc: "Experience full Standard or Premium capabilities instantly without entering payment info.",
          },
          {
            emoji: "🔄",
            title: "Prorated Freedom",
            desc: "Switch tiers or cancel anytime with zero lock-in or cancellation penalties.",
          },
          {
            emoji: "📊",
            title: "Full Tooling Unlocked",
            desc: "Live analytics dashboards, API tokens, and 3D telemetry unlock from day one.",
          },
        ],
        footerEmoji: "🎯",
        footerText: "All settings and data are preserved if you decide to upgrade.",
      });
    }

    if (
      q.includes("plan") ||
      q.includes("price") ||
      q.includes("pricing") ||
      q.includes("starter") ||
      q.includes("standard") ||
      q.includes("premium") ||
      q.includes("tier") ||
      q.includes("cost")
    ) {
      return buildStructuredCardHTML({
        headerEmoji: "💎",
        headerTitle: "PRICELUX Tier Breakdown",
        points: [
          {
            emoji: "🌱",
            title: "Starter ($29/mo)",
            desc: "Perfect for validation with essential features, 50K API quota, and community support.",
          },
          {
            emoji: "⭐",
            title: "Standard ($79/mo)",
            desc: "Most popular for growing teams—unlimited audits, webhooks & sub-second sync.",
          },
          {
            emoji: "👑",
            title: "Premium ($199/mo)",
            desc: "Full power with 99.99% SLA, dedicated infrastructure & 24/7 direct senior engineers.",
          },
        ],
        footerEmoji: "🏷️",
        footerText: "Switching to annual billing saves you 20% on all plans.",
      });
    }

    // Default structured response
    return buildStructuredCardHTML({
      headerEmoji: "✨",
      headerTitle: "PRICELUX Subscription Concierge",
      points: [
        {
          emoji: "🚀",
          title: "14-Day Free Trial",
          desc: "Explore all plan capabilities risk-free with zero upfront credit card required.",
        },
        {
          emoji: "🔄",
          title: "Prorated Billing",
          desc: "Seamless upgrades and tier switches with exact down-to-the-minute credit adjustments.",
        },
        {
          emoji: "🌐",
          title: "Global Tax Invoicing",
          desc: "Wire transfers & VAT invoices supported in USD, EUR, GBP, and INR.",
        },
      ],
      footerEmoji: "💡",
      footerText: "Ask about any specific tier, quota, SLA, or custom migration credit!",
    });
  }

  function formatGeminiTextToStructured(rawText, queryText) {
    if (!rawText) return getStructuredKnowledgeResponse(queryText);

    // If text already has bullet points or lines
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const bulletLines = lines.filter((l) => /^[-*•\d+.]\s+/.test(l));

    if (bulletLines.length >= 2) {
      const emojiMap = ["⚡", "🛡️", "💳", "🚀", "✨", "💎", "🎯", "🌐"];
      const points = bulletLines.slice(0, 4).map((line, idx) => {
        const cleaned = line.replace(/^[-*•\d+.]\s+/, "");
        const parts = cleaned.split(/:\s*|\*\*\s*-\s*|\s*—\s*/);
        const title = parts.length > 1 ? parts[0].replace(/\*\*/g, "").trim() : `Key Point ${idx + 1}`;
        const desc = parts.length > 1 ? parts.slice(1).join(": ").replace(/\*\*/g, "").trim() : cleaned.replace(/\*\*/g, "").trim();
        return {
          emoji: emojiMap[idx % emojiMap.length],
          title: title || "Feature",
          desc: desc || cleaned,
        };
      });

      return buildStructuredCardHTML({
        headerEmoji: "✨",
        headerTitle: "PRICELUX Recommendation",
        points: points,
        footerEmoji: "💡",
        footerText: "Ask for further clarification or specific enterprise terms.",
      });
    }

    // If single paragraph, parse sentences into structured points
    const sentences = rawText
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    if (sentences.length >= 2) {
      const emojiMap = ["✨", "🛡️", "⚡", "💳", "🚀"];
      const points = sentences.slice(0, 3).map((sent, idx) => {
        const words = sent.split(" ");
        const title = words.slice(0, 2).join(" ").replace(/[^a-zA-Z0-9 ]/g, "") || `Highlight ${idx + 1}`;
        return {
          emoji: emojiMap[idx % emojiMap.length],
          title: title,
          desc: sent,
        };
      });

      return buildStructuredCardHTML({
        headerEmoji: "✨",
        headerTitle: "PRICELUX Response",
        points: points,
        footerEmoji: "💡",
        footerText: "Let us know if you need customized enterprise quotes.",
      });
    }

    return getStructuredKnowledgeResponse(queryText);
  }

  async function handleConciergeInquiry(queryText) {
    if (!queryText.trim()) return;
    appendChatMessage("user", queryText);
    playHapticTone(480, "sine", 0.05, 0.03);

    const botBubble = appendChatMessage(
      "bot",
      `<div class="ai-typing-indicator">
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
        <div class="ai-typing-dot"></div>
      </div>`,
      true
    );

    const systemPrompt = `You are the expert PRICELUX Subscription Concierge. Provide a clear, human-readable structured response with emojis for every point.
Rules:
1. Do NOT write dense text paragraphs.
2. Structure your reply into 2-3 concise bullet points using emojis (✨, 🛡️, ⚡, 💳, 🚀).
3. Use a short bold title for each bullet followed by a brief 1-sentence explanation.
4. Add a quick closing takeaway with an emoji.
Knowledge:
${PRICELUX_SPECIFICATION}
- Policies: 14-day free trial on all plans (no card required upfront). Cancel or switch tiers anytime with prorated credits. Annual billing saves 20%.
- Accepted payment methods: Visa, Mastercard, AMEX, Apple Pay, Google Pay, plus SEPA/ACH wire transfers with VAT/tax invoices for annual plans in USD, EUR, GBP, and INR.
- Overage policy: We never bill surprise overages; users get notified at 80% and 90% quota and can choose to temporarily burst or upgrade.`;

    const payload = {
      contents: [{ parts: [{ text: queryText }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      if (!apiKey) {
        throw new Error("No API key configured, using local structured knowledge engine");
      }
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("API call error");
      const result = await response.json();
      const reply = result.candidates?.[0]?.content?.parts?.[0]?.text;

      const structuredHTML = formatGeminiTextToStructured(reply, queryText);
      if (botBubble) botBubble.innerHTML = structuredHTML;
      aiChatHistory.scrollTo({
        top: aiChatHistory.scrollHeight,
        behavior: "smooth",
      });
      playHapticTone(680, "sine", 0.06, 0.03);
    } catch (err) {
      // Offline fallback: use structured response engine
      setTimeout(() => {
        const structuredHTML = getStructuredKnowledgeResponse(queryText);
        if (botBubble) botBubble.innerHTML = structuredHTML;
        aiChatHistory.scrollTo({
          top: aiChatHistory.scrollHeight,
          behavior: "smooth",
        });
        playHapticTone(680, "sine", 0.06, 0.03);
      }, 350);
    }
  }

  aiChatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!aiChatInput) return;
    const val = aiChatInput.value;
    aiChatInput.value = "";
    handleConciergeInquiry(val);
  });

  document.querySelectorAll(".scenario-chip[data-faq]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const q = chip.getAttribute("data-faq");
      if (q) handleConciergeInquiry(q);
    });
  });

  /* ========================================================
     3D SPATIAL CAROUSEL ENGINE (PRICELUX RING)
     ======================================================== */
  function initSpatialCarousel() {
    const ring = document.getElementById("carouselRing");
    const viewport = document.getElementById("carouselViewport");
    const cards = Array.from(document.querySelectorAll(".pricing-spatial-card"));
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    if (!ring || !viewport || cards.length === 0) return;

    const NUM_CARDS = cards.length;
    const ANGLE_STEP = 360 / NUM_CARDS;

    // Calculate calibrated ring radius
    function getCalibratedRadius() {
      return Math.min(
        Math.max(260, window.innerWidth * 0.22),
        Math.max(280, window.innerHeight * 0.32),
        380
      );
    }

    let currentRadius = getCalibratedRadius();

    window.addEventListener("resize", () => {
      currentRadius = getCalibratedRadius();
      layoutCards();
    });

    // Position cards evenly along cylindrical ring
    function layoutCards() {
      cards.forEach((card, idx) => {
        const baseAngle = idx * ANGLE_STEP;
        card.dataset.baseAngle = baseAngle;
        updateCardSpatialTransform(card, 0, 0, 1.0, 0);
      });
    }

    function updateCardSpatialTransform(card, tiltX = 0, tiltY = 0, scale = 1.0, extraZ = 0) {
      const baseAngle = parseFloat(card.dataset.baseAngle);
      const zDist = currentRadius + extraZ;
      card.style.transform = `
        rotateY(${baseAngle}deg)
        translateZ(${zDist}px)
        scale(${scale})
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
    }

    layoutCards();

    // Carousel momentum & physics state
    let rotY = -ANGLE_STEP; // Start centered on Pro Plan (index 1)
    let targetRotY = -ANGLE_STEP;
    let rotX = -4; // Subtle top-down tilt
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let velocityX = 0;
    let autoSpin = true;
    let isCardHovered = false;

    window.rotateCarouselToCard = function (targetCard) {
      if (!targetCard) return;
      const baseAngle = parseFloat(targetCard.dataset.baseAngle);
      const currentModulo = ((targetRotY % 360) + 360) % 360;
      const targetFacing = (360 - baseAngle) % 360;
      let diff = targetFacing - currentModulo;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      targetRotY += diff;
      autoSpin = false;
      cards.forEach((c) => {
        c.classList.remove("is-active-focused");
        c.classList.remove("is-hovered");
      });
      targetCard.classList.add("is-active-focused");
    };

    // 60fps Smooth Interpolation Loop
    function animateLoop() {
      requestAnimationFrame(animateLoop);

      // Automatic continuous rotation when not dragging or inspecting a card
      if (!isDragging && !isCardHovered) {
        targetRotY -= 0.12;
      }

      if (!isDragging) {
        targetRotY += velocityX;
        velocityX *= 0.92;
        if (Math.abs(velocityX) < 0.001) velocityX = 0;
      }

      rotY += (targetRotY - rotY) * 0.1;
      ring.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      // Optical depth attenuation
      cards.forEach((card) => {
        const baseAngle = parseFloat(card.dataset.baseAngle);
        const effectiveAngle = ((baseAngle + rotY) % 360 + 360) % 360;
        const rad = (effectiveAngle * Math.PI) / 180;
        const cosDepth = Math.cos(rad);

        if (!card.classList.contains("is-hovered")) {
          const opacity = 0.42 + 0.58 * Math.max(0, (cosDepth + 0.25) / 1.25);
          const brightness = 0.65 + 0.35 * Math.max(0, cosDepth);
          card.style.opacity = opacity.toFixed(2);
          card.style.filter = `brightness(${brightness.toFixed(2)})`;
        }
      });
    }

    animateLoop();

    // Mouse Drag Navigation
    viewport.addEventListener("mousedown", (e) => {
      isDragging = true;
      autoSpin = false;
      startX = e.clientX;
      lastX = e.clientX;
      velocityX = 0;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - lastX;
      lastX = e.clientX;
      velocityX = deltaX * 0.16;
      targetRotY += deltaX * 0.32;
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch Drag Navigation
    viewport.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 0) return;
        isDragging = true;
        autoSpin = false;
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        velocityX = 0;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging || e.touches.length === 0) return;
        const deltaX = e.touches[0].clientX - lastX;
        lastX = e.touches[0].clientX;
        velocityX = deltaX * 0.18;
        targetRotY += deltaX * 0.35;
      },
      { passive: true }
    );

    window.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Viewport Trackpad / Wheel Rotation
    viewport.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          autoSpin = false;
          targetRotY -= e.deltaX * 0.18;
        } else if (e.shiftKey) {
          autoSpin = false;
          targetRotY -= e.deltaY * 0.18;
        }
      },
      { passive: true }
    );

    // Bottom HUD Navigation Buttons
    btnPrev?.addEventListener("click", () => {
      autoSpin = false;
      targetRotY += ANGLE_STEP;
      playHapticTone(540, "sine", 0.05, 0.02);
    });

    btnNext?.addEventListener("click", () => {
      autoSpin = false;
      targetRotY -= ANGLE_STEP;
      playHapticTone(580, "sine", 0.05, 0.02);
    });

    // 3D Parallax Hover & Elevation Listeners
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        isCardHovered = true;
        autoSpin = false;
        cards.forEach((c) => c.classList.remove("is-active-focused"));
        card.classList.add("is-hovered");
        card.classList.add("is-active-focused");
        card.style.opacity = "1";
        card.style.filter = "brightness(1.06)";
        updateCardSpatialTransform(card, 0, 0, 1.06, 35);
      });

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = -normY * 10;
        const tiltY = normX * 12;
        updateCardSpatialTransform(card, tiltX, tiltY, 1.06, 35);
      });

      card.addEventListener("mouseleave", () => {
        isCardHovered = false;
        card.classList.remove("is-hovered");
        updateCardSpatialTransform(card, 0, 0, 1.0, 0);
      });

      card.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        if (Math.abs(startX - lastX) > 8) return;
        window.rotateCarouselToCard(card);
      });
    });
  }

  // 3D Parallax Tilt, Cursor Spotlight & Interactive Controls for all 5 Viral Cards
  function initViralFeatureCards() {
    const allCards = document.querySelectorAll(
      ".viral-feature-card, .viral-analytics-card, .viral-testimonial-card"
    );

    allCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;
        const tiltX = -normY * 6;
        const tiltY = normX * 6;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.removeProperty("--mouse-x");
        card.style.removeProperty("--mouse-y");
      });
    });

    // Real-Time Analytics Period Filter Controls
    const periodBtns = document.querySelectorAll(".analytics-period-btn");
    const bigVal = document.getElementById("analyticsBigVal");
    const growthVal = document.getElementById("analyticsGrowthVal");

    const periodData = {
      "1h": { val: "4.8K", growth: "+8.2%" },
      "24h": { val: "42.1K", growth: "+16.4%" },
      "7d": { val: "84.3K", growth: "+21.0%" },
      "live": { val: "98.7K", growth: "+24.5%" },
    };

    periodBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        periodBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const period = btn.getAttribute("data-period");
        if (periodData[period] && bigVal && growthVal) {
          bigVal.textContent = periodData[period].val;
          growthVal.textContent = periodData[period].growth;
          playHapticTone(560, "sine", 0.05, 0.03);
        }
      });
    });
  }
  initViralFeatureCards();

  /* ========================================================
     LUXURY ANIMATED COSMIC CURSOR FOLLOWER ENGINE
     ======================================================== */
  function initLuxuryCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.getElementById("cursorDot");
    const follower = document.getElementById("cursorFollower");
    if (!dot || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let isVisible = false;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.classList.remove("cursor-hidden");
        follower.classList.remove("cursor-hidden");
        followerX = mouseX;
        followerY = mouseY;
        dotX = mouseX;
        dotY = mouseY;
      }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      isVisible = false;
      dot.classList.add("cursor-hidden");
      follower.classList.add("cursor-hidden");
    });

    document.addEventListener("mouseenter", () => {
      isVisible = true;
      dot.classList.remove("cursor-hidden");
      follower.classList.remove("cursor-hidden");
    });

    window.addEventListener("mousedown", () => {
      document.body.classList.add("cursor-active");
    }, { passive: true });

    window.addEventListener("mouseup", () => {
      document.body.classList.remove("cursor-active");
    }, { passive: true });

    const interactiveSelector =
      "a, button, input, textarea, select, [role='button'], .scenario-chip, .pricing-spatial-card, .faq-item, .viral-feature-card, .tab-btn, .cadence-toggle-pill, .currency-btn, .modal-close-btn";

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.add("cursor-hover");
      }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.remove("cursor-hover");
      }
    }, { passive: true });

    function renderCursor() {
      if (isVisible) {
        dotX += (mouseX - dotX) * 0.75;
        dotY += (mouseY - dotY) * 0.75;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

        followerX += (mouseX - followerX) * 0.16;
        followerY += (mouseY - followerY) * 0.16;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }
  initLuxuryCursor();

  initSpatialCarousel();
}

// Execute application setup when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPricelux);
} else {
  initPricelux();
}
