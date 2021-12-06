import { getType, getValue, isNumeric, query, closest } from "./util";

export class Validator {
	constructor(elForm, rules, options) {
		this.elForm = query(elForm);

		if (!this.elForm) {
			throw Error("elForm must be an form Element.");
		}

		this.options = Object.assign({
			preventSubmit: true,
			errorClass: "form-item__error",
			errorParentClass: 'form-item__content'
		}, options);
		
		this.fields = {};
		this.rules = {};
		this.__handlers = [];

		if (this.options.preventSubmit !== false) {
			this.__handlers.push({
				el: this.elForm,
				type: "submit",
				handler: e => {
					e.preventDefault();
				}
			});
		}

		this.addRules(rules);

		this.addListeners();
	}

	addListeners() {
		this.__handlers.forEach(({ el, type, handler }) => {
			el.addEventListener(type, handler, false);
		});
	}

	removeListeners() {
		this.__handlers.forEach(({ el, type, handler }) => {
			el.removeEventListener(type, handler, false);
		});
		this.__handlers = [];
	}

	destroy() {
		this.removeListeners();
		this.rules = {};
		this.fields = {};
	}

	isRequired(prop) {
		if (!this.rules[prop]) return false;
		return this.rules[prop].some(rule => rule.required);
	}

	addRules(rules) {
		if (rules) {
			Object.keys(rules).forEach(prop => {
				if (this.rules[prop]) {
					this.rules[prop] = this.rules[prop].concat(rules[prop]);
				} else {
					this.rules[prop] = rules[prop];
				}

				this.addField(prop);
			});
		}
	}

	addField(prop) {
		if (!this.fields[prop]) {
			const el = query('[data-prop="'+ prop +'"]', this.elForm);

			if (!el) return;

			const fieldEl = query('[data-field="'+ prop +'"]', el);

			if (!fieldEl) return;

			if (this.isRequired(prop)) {
				el.classList.add("is-required");
			}

			let trigger;

			if (trigger = fieldEl.getAttribute('data-trigger')) {
				this.__handlers.push({
					el: fieldEl,
					type: trigger,
					handler: this.validate.bind(this, prop)
				});
			} else if ("TEXTAREA" === fieldEl.nodeName || "INPUT" === fieldEl.nodeName && (!["radio", "checkbox"].includes(fieldEl.type))) {
				this.__handlers.push({
					el: fieldEl,
					type: "blur",
					handler: this.validate.bind(this, prop, null)
				});
			} else {
				this.__handlers.push({
					el: fieldEl,
					type: "change",
					handler: this.validate.bind(this, prop, null)
				});
			}

			this.fields[prop] = {
				el,
				fieldEl
			};
		}
	}

	validate(prop, callback) {
		if (getType(prop) === "string") {
			this.validateField(prop, callback);
		} else {
			let fieldsKeys;

			if (getType(prop) === "array") {
				fieldsKeys = prop;
			} else {
				fieldsKeys = Object.keys(this.fields);
				callback = prop;
				prop = null;
			}
			
			let count = 0;
			let noError = true;
			
			fieldsKeys.forEach(prop => {
				this.validateField(prop, valid => {
					count++;

					if (!valid) {
						noError = false;
					}

					if (count >= fieldsKeys.length) {
						callback && callback(noError);
					}
				});
			});
		}
	}

	validateField(prop, callback) {
		if (prop && this.fields[prop]) {
			const propValue = getValue(this.fields[prop].fieldEl);
			
			let hasError = false;
			let currentRule;

			this.rules[prop].some(rule => {
				if (rule.validator) {
					rule.validator(rule, propValue, err => {
						if (err && err instanceof Error) {
							hasError = true;

							if (!rule.message) {
								rule.message = err.message;
							}
						}
					});
				} else if (rule.required) {
					hasError = propValue === "";
				} else if (rule.type) {
					if (rule.type === "number") {
						hasError = !isNumeric(propValue);
					} else {
						hasError = getType(propValue) !== rule.type;
					}
				}

				currentRule = rule;

				return hasError;
			});

			if (hasError) {
				this.showErrorMsg(prop, currentRule.message);
			} else {
				this.hideErrorMsg(prop);
			}

			callback && callback(!hasError);
		}
	}

	clearValidate(prop) {
		let props;

		if (prop) {
			if (getType(prop) === "array") {
				props = prop;
				prop = null;
			} else {
				props = [ prop ];
			}
		} else {
			props = Object.keys(this.fields);
		}

		props.forEach(k => {
			if (k && this.fields[k]) {
				this.hideErrorMsg(k);
			}
		});
	}

	showErrorMsg(prop, errMsg) {
		if (prop && this.fields[prop]) {
			const { el, fieldEl } = this.fields[prop];

			let errEl = query("." + this.options.errorClass, el);

			if (!errEl) {
				errEl = document.createElement("p");
				errEl.classList.add(this.options.errorClass);
				query("." + this.options.errorParentClass, el).appendChild(errEl);
			}

			errEl.textContent = errMsg;
			el.classList.add("is-error");
			fieldEl.classList.add("is-error");
		}
	}

	hideErrorMsg(prop) {
		if (prop && this.fields[prop]) {
			const { el, fieldEl } = this.fields[prop];

			let errEl = query("." + this.options.errorClass, el);

			if (errEl) {
				errEl.parentNode.removeChild(errEl);
			}

			el.classList.remove("is-error");
			fieldEl.classList.remove("is-error");
		}
	}
}