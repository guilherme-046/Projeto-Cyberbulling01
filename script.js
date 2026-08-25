/* =========================================================
   CYBERSAFE — JAVASCRIPT
   Interatividade sem frameworks.
   ========================================================= */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initScrollEffects();
  initReveal();
  initCounters();
  initModals();
  initTypes();
  initMyths();
  initQuiz();
  initSimulator();
  initTheme();
  initFaq();
});

function initNavigation() {
  const header = $("#siteHeader");
  const menuToggle = $("#menuToggle");
  const nav = $("#mainNav");

  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.innerHTML = `<i class="fa-solid ${open ? "fa-xmark" : "fa-bars"}"></i>`;
  });

  $$("#mainNav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    });
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  // Destaque da seção atual no menu.
  const sections = $$("main section[id]");
  const links = $$("#mainNav a");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        ));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));
}

function initScrollEffects() {
  const progress = $("#scrollProgress");
  const backTop = $("#backTop");

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${percentage}%`;
    backTop.classList.toggle("visible", window.scrollY > 650);
  };

  window.addEventListener("scroll", update, { passive: true });
  update();

  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  items.forEach(item => observer.observe(item));
}

function initCounters() {
  const counters = $$("[data-counter]");
  const animate = element => {
    const target = Number(element.dataset.counter);
    const suffix = element.nextElementSibling?.textContent || "";
    let start = 0;
    const duration = 900;
    const startTime = performance.now();

    const frame = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .7 });
  counters.forEach(counter => observer.observe(counter));
}

function initModals() {
  let lastFocused = null;

  const openModal = modal => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    const close = $("[data-close-modal]", modal);
    close?.focus();
  };

  const closeModal = modal => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
    lastFocused?.focus?.();
  };

  $$("[data-modal]").forEach(button => {
    button.addEventListener("click", () => openModal($(`#${button.dataset.modal}`)));
  });

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => closeModal(button.closest(".modal")));
  });

  $$(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const open = $(".modal:not([hidden])");
      if (open) closeModal(open);
    }
  });

  window.openCyberModal = openModal;
}

const typeData = [
  ["01", "Ofensas", "fa-comment-slash", "Comentários ou mensagens direcionadas para atacar, humilhar ou constranger alguém."],
  ["02", "Ameaças", "fa-triangle-exclamation", "Mensagens que buscam provocar medo ou pressionar uma pessoa."],
  ["03", "Humilhação pública", "fa-bullhorn", "Exposição em espaços digitais com intenção de constranger."],
  ["04", "Exclusão de grupos", "fa-user-minus", "Usar espaços digitais para isolar intencionalmente alguém."],
  ["05", "Divulgação de informações pessoais", "fa-user-lock", "Compartilhar dados pessoais sem autorização pode colocar alguém em risco."],
  ["06", "Perfis falsos", "fa-user-secret", "Criar ou usar identidades falsas para enganar, atacar ou prejudicar."],
  ["07", "Perseguição digital", "fa-eye", "Comportamentos repetidos de monitoramento, contato ou pressão indesejada."],
  ["08", "Imagens sem consentimento", "fa-image", "Divulgar imagens de alguém sem autorização pode causar danos e violar direitos."]
];

function initTypes() {
  const grid = $("#typeGrid");
  const modal = $("#typeModal");
  const title = $("#typeModalTitle");
  const text = $("#typeModalText");
  const eyebrow = $("#typeModalEyebrow");

  grid.innerHTML = typeData.map(([number, name, icon, description]) => `
    <button class="type-card" data-type="${number}" aria-label="Saiba mais sobre ${name}">
      <span class="type-number">${number}</span>
      <i class="fa-solid ${icon}"></i>
      <h3>${name}</h3>
      <p>Toque para entender.</p>
      <span class="open-label">Saiba mais →</span>
    </button>
  `).join("");

  $$(".type-card", grid).forEach(card => {
    card.addEventListener("click", () => {
      const item = typeData.find(item => item[0] === card.dataset.type);
      if (!item) return;
      eyebrow.textContent = `Categoria ${item[0]}`;
      title.textContent = item[1];
      text.textContent = item[3];
      window.openCyberModal?.(modal);
    });
  });
}

function initMyths() {
  $$(".myth-card").forEach(card => {
    card.addEventListener("click", () => {
      const answer = card.dataset.answer;
      const explanation = card.dataset.explanation;
      const box = $(".myth-answer", card);
      card.classList.toggle("open");
      box.setAttribute("data-text", `${answer.toUpperCase()}: ${explanation}`);
    });
  });
}

const quizQuestions = [
  {
    question: "O que caracteriza o cyberbullying?",
    answers: ["Uma discussão saudável", "Agressões ou perseguições realizadas por meios digitais", "Uma conversa entre amigos", "Uma publicação comum"],
    correct: 1,
    explanation: "Cyberbullying envolve comportamentos prejudiciais realizados por meios digitais."
  },
  {
    question: "Qual atitude é mais indicada ao receber uma mensagem ofensiva?",
    answers: ["Responder com outra ofensa", "Compartilhar com todo mundo", "Evitar resposta impulsiva e procurar apoio", "Criar uma conta falsa"],
    correct: 2,
    explanation: "Priorizar a segurança, preservar registros e buscar apoio são atitudes mais responsáveis."
  },
  {
    question: "Por que guardar evidências pode ser importante?",
    answers: ["Para aumentar a discussão", "Para explicar o que aconteceu quando for necessário", "Para publicar novamente", "Para ameaçar a outra pessoa"],
    correct: 1,
    explanation: "Registros podem ajudar adultos, escolas ou plataformas a entender a situação."
  },
  {
    question: "Compartilhar uma publicação ofensiva pode...",
    answers: ["Não fazer diferença", "Ajudar automaticamente a vítima", "Aumentar o alcance do conteúdo prejudicial", "Resolver o conflito"],
    correct: 2,
    explanation: "Compartilhamentos podem ampliar a exposição e contribuir para o problema."
  },
  {
    question: "Quem pode ajudar em uma situação difícil?",
    answers: ["Somente colegas", "Um adulto de confiança, professor ou responsável", "Ninguém", "Apenas desconhecidos"],
    correct: 1,
    explanation: "Conversar com um adulto de confiança pode ajudar a encontrar caminhos seguros."
  },
  {
    question: "Qual destas atitudes ajuda na prevenção?",
    answers: ["Pensar antes de publicar", "Publicar dados pessoais", "Humilhar quem discorda", "Compartilhar rumores"],
    correct: 0,
    explanation: "Pensar nas consequências antes de publicar é uma boa prática de cidadania digital."
  },
  {
    question: "Bloquear e denunciar uma conta pode ser...",
    answers: ["Um recurso de segurança da plataforma", "Uma forma de vingança", "Sempre ilegal", "Uma competição"],
    correct: 0,
    explanation: "Plataformas oferecem recursos de bloqueio e denúncia para lidar com comportamentos inadequados."
  },
  {
    question: "Um sinal de que alguém pode estar enfrentando dificuldades online é...",
    answers: ["Necessariamente ficar feliz", "Mudar hábitos digitais ou demonstrar desconforto", "Sempre usar o celular", "Ter muitos seguidores"],
    correct: 1,
    explanation: "Mudanças podem ser um sinal, mas não provam por si só que existe cyberbullying."
  },
  {
    question: "O que fazer ao perceber ataques contra um colega?",
    answers: ["Aumentar a divulgação", "Participar da ofensa", "Apoiar a pessoa e procurar ajuda adequada", "Fazer piada"],
    correct: 2,
    explanation: "Apoio, não compartilhamento do conteúdo e busca de ajuda são atitudes responsáveis."
  },
  {
    question: "Qual frase representa cidadania digital?",
    answers: ["Por trás de uma tela não existe consequência", "Posso publicar qualquer coisa", "Respeito também vale no ambiente digital", "Problemas online nunca importam"],
    correct: 2,
    explanation: "As pessoas continuam sendo pessoas, mesmo quando estão atrás de uma tela."
  }
];

let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function initQuiz() {
  renderQuestion();
  $("#nextQuestion").addEventListener("click", nextQuestion);
  $("#restartQuiz").addEventListener("click", restartQuiz);
}

function renderQuestion() {
  const container = $("#quizContent");
  const q = quizQuestions[quizIndex];
  quizAnswered = false;

  $("#quizProgressText").textContent = `Pergunta ${quizIndex + 1} de ${quizQuestions.length}`;
  $("#quizProgressBar").style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;
  $("#quizScore").textContent = `${quizScore} ${quizScore === 1 ? "acerto" : "acertos"}`;
  $("#nextQuestion").disabled = true;
  $("#nextQuestion").classList.remove("hidden");
  $("#restartQuiz").classList.add("hidden");

  container.innerHTML = `
    <span class="question-number">Questão ${quizIndex + 1}</span>
    <h3 class="question-title">${q.question}</h3>
    <div class="answer-grid">
      ${q.answers.map((answer, index) => `
        <button class="answer-btn" data-index="${index}">
          <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
          <span>${answer}</span>
        </button>
      `).join("")}
    </div>
    <div class="quiz-feedback hidden" id="quizFeedback"></div>
  `;

  $$(".answer-btn", container).forEach(button => {
    button.addEventListener("click", () => selectAnswer(Number(button.dataset.index)));
  });
}

function selectAnswer(index) {
  if (quizAnswered) return;
  quizAnswered = true;

  const q = quizQuestions[quizIndex];
  const buttons = $$(".answer-btn");
  buttons.forEach(button => button.disabled = true);

  if (index === q.correct) {
    quizScore++;
    buttons[index].classList.add("correct");
  } else {
    buttons[index].classList.add("wrong");
    buttons[q.correct].classList.add("correct");
  }

  $("#quizScore").textContent = `${quizScore} ${quizScore === 1 ? "acerto" : "acertos"}`;
  const feedback = $("#quizFeedback");
  feedback.classList.remove("hidden");
  feedback.innerHTML = `<strong>${index === q.correct ? "Muito bem!" : "Quase!"}</strong> ${q.explanation}`;
  $("#nextQuestion").disabled = false;
}

function nextQuestion() {
  if (!quizAnswered) return;
  if (quizIndex < quizQuestions.length - 1) {
    quizIndex++;
    renderQuestion();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const percentage = Math.round((quizScore / quizQuestions.length) * 100);
  let message = "Continue aprendendo: pequenas atitudes fazem diferença.";
  if (percentage >= 90) message = "Excelente! Você demonstrou que conhece boas práticas para tornar a internet mais segura.";
  else if (percentage >= 70) message = "Muito bom! Você já conhece várias atitudes importantes para uma convivência digital mais segura.";
  else if (percentage >= 50) message = "Bom começo! Revise algumas seções e tente novamente para reforçar seus conhecimentos.";

  $("#quizContent").innerHTML = `
    <div class="quiz-result">
      <div class="result-score">${percentage}%</div>
      <h3>${quizScore} de ${quizQuestions.length} acertos</h3>
      <p>${message}</p>
    </div>
  `;
  $("#quizProgressText").textContent = "Quiz concluído";
  $("#quizProgressBar").style.width = "100%";
  $("#quizScore").textContent = `${quizScore} acertos`;
  $("#nextQuestion").classList.add("hidden");
  $("#restartQuiz").classList.remove("hidden");
}

function restartQuiz() {
  quizIndex = 0;
  quizScore = 0;
  renderQuestion();
}

const scenarios = [
  {
    title: "Comentários ofensivos em um grupo",
    text: "Você percebe que alguém da sua turma está sendo alvo de comentários ofensivos em um grupo.",
    options: [
      ["Ignorar completamente", false],
      ["Compartilhar para mostrar aos outros", false],
      ["Responder com outra ofensa", false],
      ["Apoiar a pessoa e procurar ajuda adequada", true]
    ],
    feedback: "Apoiar a pessoa sem ampliar o conteúdo e procurar um adulto de confiança é uma atitude responsável."
  },
  {
    title: "Uma imagem foi compartilhada sem consentimento",
    text: "Você descobre que uma imagem de um colega está circulando sem que ele tenha autorizado.",
    options: [
      ["Repassar para mais pessoas", false],
      ["Fazer uma piada sobre a situação", false],
      ["Não compartilhar e incentivar a busca por ajuda", true],
      ["Criar uma postagem sobre o colega", false]
    ],
    feedback: "Não ampliar a exposição e procurar apoio ajuda a reduzir danos e respeitar a privacidade."
  },
  {
    title: "Você recebeu uma mensagem agressiva",
    text: "Uma conta envia mensagens agressivas e você percebe que está ficando desconfortável.",
    options: [
      ["Responder imediatamente", false],
      ["Guardar registros, bloquear/denunciar e contar a alguém", true],
      ["Publicar os dados da pessoa", false],
      ["Criar uma conta para atacá-la", false]
    ],
    feedback: "Evitar uma escalada, preservar registros e procurar apoio são atitudes mais seguras."
  },
  {
    title: "Um amigo está evitando redes sociais",
    text: "Seu amigo mudou os hábitos digitais e parece desconfortável depois de usar o celular.",
    options: [
      ["Fazer pressão para ele contar", false],
      ["Ignorar porque não é problema seu", false],
      ["Perguntar com cuidado e oferecer apoio", true],
      ["Contar para todo mundo", false]
    ],
    feedback: "Uma conversa acolhedora, sem pressão, pode abrir espaço para que a pessoa procure ajuda."
  },
  {
    title: "Você vê uma publicação humilhante",
    text: "Uma publicação tenta constranger alguém e está começando a receber muitos compartilhamentos.",
    options: [
      ["Compartilhar também", false],
      ["Comentar incentivando os ataques", false],
      ["Não compartilhar e usar recursos de denúncia quando apropriado", true],
      ["Criar outra publicação para competir", false]
    ],
    feedback: "Não aumentar o alcance do conteúdo e usar os recursos adequados da plataforma é uma escolha responsável."
  }
];

let scenarioIndex = 0;

function initSimulator() {
  renderScenario();
  $("#nextScenario").addEventListener("click", () => {
    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    renderScenario();
  });
}

function renderScenario() {
  const scenario = scenarios[scenarioIndex];
  $("#scenarioNumber").textContent = `Situação ${scenarioIndex + 1} de ${scenarios.length}`;
  $("#scenarioBar").style.width = `${((scenarioIndex + 1) / scenarios.length) * 100}%`;
  $("#scenarioTitle").textContent = scenario.title;
  $("#scenarioText").textContent = scenario.text;

  const options = $("#scenarioOptions");
  const feedback = $("#scenarioFeedback");
  const next = $("#nextScenario");

  feedback.classList.remove("show");
  feedback.innerHTML = "";
  next.classList.add("hidden");

  options.innerHTML = scenario.options.map(([text], index) =>
    `<button class="scenario-option" data-index="${index}">${text}</button>`
  ).join("");

  $$(".scenario-option", options).forEach(button => {
    button.addEventListener("click", () => {
      $$(".scenario-option", options).forEach(b => b.disabled = true);
      const selected = scenario.options[Number(button.dataset.index)];
      button.classList.add("selected");
      feedback.classList.add("show");
      feedback.innerHTML = selected[1]
        ? `<strong>Boa escolha.</strong>${scenario.feedback}`
        : `<strong>Vale repensar.</strong>${scenario.feedback}`;
      next.classList.remove("hidden");
    });
  });
}

function initTheme() {
  const button = $("#themeToggle");
  const stored = localStorage.getItem("cybersafe-theme");
  if (stored === "light") document.body.classList.add("light");
  updateThemeIcon();

  button.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("cybersafe-theme", document.body.classList.contains("light") ? "light" : "dark");
    updateThemeIcon();
  });

  function updateThemeIcon() {
    button.innerHTML = `<i class="fa-solid ${document.body.classList.contains("light") ? "fa-sun" : "fa-moon"}"></i>`;
    button.setAttribute("aria-label", document.body.classList.contains("light") ? "Ativar tema escuro" : "Ativar tema claro");
  }
}

function initFaq() {
  $$(".faq-list details").forEach(detail => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        $$(".faq-list details").forEach(other => {
          if (other !== detail) other.removeAttribute("open");
        });
      }
    });
  });
}
