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

export function debounce(fn, wait, immediate, triggerEnd) {
	var context;
	var args;
	var timer;
	var timestamp;
	var result;
	var later = function() {
		var last = new Date().getTime() - timestamp;

		if(last < wait && last >= 0) {
			timer = setTimeout(later, wait - last);
		} else {
			timer = null;

			if(!immediate || immediate && triggerEnd) {
				result = fn.apply(context, args);
				context = args = null;

				return result;
			}
		}
	};

	var debounced = function() {
		context = this;
		timestamp = new Date().getTime();
		args = arguments;

		var callNow = immediate && !timer;

		if(!timer) {
			timer = setTimeout(later, wait);
		}

		if(callNow) {
			result = fn.apply(context, args);
			
			if(!triggerEnd) {
				context = args = null;
			}

			return result;
		}
	};

	debounced.cancel = function() {
		clearTimeout(timer);

		timer = null;
		context = args = null;
	};

	return debounced;
};