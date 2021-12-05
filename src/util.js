export function query(selector, ctx) {
	ctx = ctx || document;

	if (selector instanceof Node) return selector;

	return ctx.querySelector(selector);
}

export function closest(el, selector) {
	if (!el) return;

	el = query(el);

	var parent = el.parentNode;

	while(parent && parent !== document.body) {
		if (parent.matches(selector)) {
			return parent;
		}

		parent = parent.parentNode;
	}
}

export function getType(value) {
	return Object.prototype.toString.call(value).slice(8,-1).toLowerCase();
}

export function getValue(fieldEl) {
	let value;

	if (fieldEl.nodeName === "SELECT") {
		if (fieldEl.multiple) {
			value = [];

			for (let item of fieldEl.selectedOptions) {
				value.push(item.value);
			}
		} else {
			value = fieldEl.selectedOptions[0].value;
		}
	} else {
		value = fieldEl.value;
	}

	return value;
}

export function isNumeric(n) {
	return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}