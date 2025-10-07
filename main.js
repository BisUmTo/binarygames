const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class BalanceGame {
  constructor(root) {
    this.root = root;
    this.weights = [1, 2, 4, 8, 16, 32];
    this.state = {
      round: 1,
      target: 0,
      selected: new Set()
    };
    this.roundTimeout = null;

    this.elements = {
      weightsList: root.querySelector(".weights-list"),
      plateItems: root.querySelector(".plate-items"),
      roundCounter: root.querySelector(".round-counter"),
      currentSum: root.querySelector(".current-sum"),
      targetValue: root.querySelector(".target-value"),
      nextRoundBtn: root.querySelector(".next-round"),
      message: root.querySelector(".message")
    };

    this.renderWeights();
    this.attachEvents();
    this.startRound({ resetRoundCounter: false });
  }

  renderWeights() {
    this.elements.weightsList.innerHTML = "";
    this.weights.forEach((value) => {
      const item = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "weight";
      btn.dataset.value = value;
      btn.textContent = value;
      btn.title = `Peso da ${value}`;
      btn.addEventListener("click", () => this.toggleWeight(value));
      btn.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          this.toggleWeight(value);
        }
      });
      btn.setAttribute("aria-pressed", "false");
      btn.tabIndex = 0;
      item.appendChild(btn);
      this.elements.weightsList.appendChild(item);
    });
  }

  attachEvents() {
    this.elements.nextRoundBtn.addEventListener("click", () => {
      this.startRound({ resetRoundCounter: true });
    });
  }

  toggleWeight(value) {
    if (this.state.selected.has(value)) {
      this.state.selected.delete(value);
    } else {
      this.state.selected.add(value);
    }
    this.updateWeightsUI();
    this.updatePlate();
    this.updateStatus();
    this.checkCompletion();
  }

  updateWeightsUI() {
    this.elements.weightsList.querySelectorAll(".weight").forEach((btn) => {
      const val = Number(btn.dataset.value);
      const isActive = this.state.selected.has(val);
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  updatePlate() {
    this.elements.plateItems.innerHTML = "";
    const items = Array.from(this.state.selected).sort((a, b) => a - b);
    items.forEach((value) => {
      const li = document.createElement("li");
      li.textContent = value;
      this.elements.plateItems.appendChild(li);
    });
  }

  updateStatus() {
    const sum = this.getCurrentSum();
    this.elements.currentSum.textContent = sum;
  }

  getCurrentSum() {
    let total = 0;
    this.state.selected.forEach((value) => (total += value));
    return total;
  }

  startRound({ resetRoundCounter }) {
    if (this.roundTimeout) {
      clearTimeout(this.roundTimeout);
      this.roundTimeout = null;
    }
    this.state.selected.clear();
    this.updateWeightsUI();
    this.updatePlate();
    this.elements.currentSum.textContent = "0";
    this.elements.message.textContent = "";

    if (resetRoundCounter) {
      this.state.round += 1;
    }
    this.state.target = randomInt(1, this.weights.reduce((acc, val) => acc + val, 0));

    this.elements.targetValue.textContent = this.state.target;
    this.elements.roundCounter.textContent = this.state.round;
  }

  checkCompletion() {
    if (this.getCurrentSum() === this.state.target) {
      this.elements.message.textContent = "Perfetto! Hai bilanciato il numero.";
      this.roundTimeout = setTimeout(() => {
        this.state.round += 1;
        this.startRound({ resetRoundCounter: false });
      }, 1400);
    } else {
      this.elements.message.textContent = "";
    }
  }
}

class SwitchesGame {
  constructor(root) {
    this.root = root;
    this.bits = Array.from({ length: 8 }, (_, idx) => 2 ** (7 - idx));
    this.state = {
      target: 0,
      active: new Set()
    };
    this.roundTimeout = null;

    this.elements = {
      switchesRow: root.querySelector(".switches-row"),
      currentValue: root.querySelector(".current-value"),
      targetValue: root.querySelector(".target-value"),
      nextRoundBtn: root.querySelector(".next-round"),
      message: root.querySelector(".message")
    };

    this.renderSwitches();
    this.attachEvents();
    this.startRound({ keepMessage: false });
  }

  renderSwitches() {
    this.elements.switchesRow.innerHTML = "";
    this.bits.forEach((value) => {
      const switchEl = document.createElement("button");
      switchEl.type = "button";
      switchEl.className = "switch";
      switchEl.dataset.value = value;
      switchEl.title = `Interruttore da ${value}`;
      switchEl.innerHTML = `
        <div class="bulb" aria-hidden="true"></div>
        <div class="toggle" aria-hidden="true"></div>
        <div class="bit-value">${value}</div>
      `;
      switchEl.setAttribute("aria-pressed", "false");
      switchEl.addEventListener("click", () => this.toggleSwitch(value));
      switchEl.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          this.toggleSwitch(value);
        }
      });
      this.elements.switchesRow.appendChild(switchEl);
    });
  }

  attachEvents() {
    this.elements.nextRoundBtn.addEventListener("click", () => {
      this.startRound({ keepMessage: false });
    });
  }

  toggleSwitch(value) {
    if (this.state.active.has(value)) {
      this.state.active.delete(value);
    } else {
      this.state.active.add(value);
    }
    this.updateSwitchUI();
    this.updateStatus();
    this.checkCompletion();
  }

  updateSwitchUI() {
    this.elements.switchesRow.querySelectorAll(".switch").forEach((switchEl) => {
      const val = Number(switchEl.dataset.value);
      const isActive = this.state.active.has(val);
      switchEl.classList.toggle("active", isActive);
      switchEl.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  updateStatus() {
    const current = this.getCurrentValue();
    this.elements.currentValue.textContent = current;
  }

  getCurrentValue() {
    let total = 0;
    this.state.active.forEach((value) => (total += value));
    return total;
  }

  startRound({ keepMessage }) {
    if (this.roundTimeout) {
      clearTimeout(this.roundTimeout);
      this.roundTimeout = null;
    }
    this.state.active.clear();
    this.updateSwitchUI();
    this.updateStatus();

    this.state.target = randomInt(1, 255);
    this.elements.targetValue.textContent = this.state.target;

    if (!keepMessage) {
      this.elements.message.textContent = "";
    }
  }

  checkCompletion() {
    if (this.getCurrentValue() === this.state.target) {
      this.elements.message.textContent = "Ben fatto! Nuovo round in arrivo...";
      this.roundTimeout = setTimeout(() => {
        this.startRound({ keepMessage: false });
      }, 1400);
    } else {
      this.elements.message.textContent = "";
    }
  }
}

class TabsController {
  constructor(container) {
    this.container = container;
    this.buttons = Array.from(container.querySelectorAll('[role="tab"]'));
    this.panels = this.buttons
      .map((button) => {
        const panelId = button.getAttribute("aria-controls");
        return panelId ? document.getElementById(panelId) : null;
      })
      .filter(Boolean);

    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.bindEvents();
    const initial = this.buttons.find((button) => button.getAttribute("aria-selected") === "true") || this.buttons[0];
    if (initial) {
      this.activate(initial, { focus: false });
    }
  }

  bindEvents() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", this.handleClick);
      button.addEventListener("keydown", this.handleKeydown);
      button.setAttribute("tabindex", button.getAttribute("aria-selected") === "true" ? "0" : "-1");
    });
  }

  handleClick(event) {
    const target = event.currentTarget;
    this.activate(target);
  }

  handleKeydown(event) {
    const keyActions = {
      ArrowRight: () => this.focusSibling(1),
      ArrowLeft: () => this.focusSibling(-1),
      ArrowDown: () => this.focusSibling(1),
      ArrowUp: () => this.focusSibling(-1),
      Home: () => this.focusIndex(0),
      End: () => this.focusIndex(this.buttons.length - 1)
    };

    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  focusSibling(offset) {
    const currentIndex = this.buttons.findIndex((button) => button.getAttribute("aria-selected") === "true");
    const nextIndex = (currentIndex + offset + this.buttons.length) % this.buttons.length;
    this.activate(this.buttons[nextIndex]);
  }

  focusIndex(index) {
    if (index >= 0 && index < this.buttons.length) {
      this.activate(this.buttons[index]);
    }
  }

  activate(button, { focus = true } = {}) {
    const targetPanelId = button.getAttribute("aria-controls");

    this.buttons.forEach((tab) => {
      const isActive = tab === button;
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (!isActive) {
        tab.blur();
      }
    });

    this.panels.forEach((panel) => {
      if (panel.id === targetPanelId) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });

    if (focus) {
      button.focus();
    }
  }
}

const initFooterYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const balanceRoot = document.getElementById("balance-game");
  const switchesRoot = document.getElementById("switches-game");
  if (balanceRoot) {
    new BalanceGame(balanceRoot);
  }
  if (switchesRoot) {
    new SwitchesGame(switchesRoot);
  }
  document.querySelectorAll("[data-tabs]").forEach((tabContainer) => {
    new TabsController(tabContainer);
  });
  initFooterYear();
});
