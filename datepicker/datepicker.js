class DatePicker {

	#element;
	#randomId;
	#parentDiv;

	constructor(el) {
		this.#randomId = "div-id-" + this.#makeid(10);
		this.#element = el;
		if (typeof el == "string") throw "have to be element";
		this.#configureElement();
		/////////////////////////////////////////////
		this.#parentDiv = this.#_("div");
		this.#parentDiv.id = this.#randomId;

		this.#parentDiv.classList.add("datepicker-parent", "datepicker-hide-parent");

		document.addEventListener("click", function(pd) {
			return function(e) {
				if (pd.getId() != e.target.getAttribute("data-magic")) {
					pd.hide();
				}
			}
		}(this));
	}

	/*
	* configure the input element
	*/
	#configureElement() {
		this.#element.setAttribute("data-magic", this.#randomId);
		this.#element.className = "datepicker_element"
		this.#element.readOnly = true;
		this.#element.onfocus = function(pd) {
			return function() {
				if (pd.isHidden()) {
					pd.show();
					let date = new Date(this.value);
					pd.calendar(isNaN(date) ? new Date() : date);
				} else {
					pd.hide()
				}
			}
		}(this);
	}

	isHidden() {
		return this.#parentDiv.classList.contains("datepicker-hide-parent");
	}
	hide() {
		this.#parentDiv.classList.add("datepicker-hide-parent");
	}

	show() {
		var rect = this.#element.getBoundingClientRect();
		this.#parentDiv.style.left = rect.left;
		this.#parentDiv.style.top = (parseInt(rect.bottom) + 2) + "px";
		this.#parentDiv.classList.remove("datepicker-hide-parent");
	}

	getId() {
		return this.#randomId;
	}

	#createAllDate(tBody, dt) {
		let inpDt = new Date(this.#element);
		let today = new Date();
		// first date
		let fstDt = new Date(dt.getFullYear(), dt.getMonth());
		// work date
		let wDt;
		if (fstDt.getDay() != 0) {
			wDt = new Date(fstDt.getFullYear(), fstDt.getMonth(), fstDt.getDay() - 7);
		} else {
			wDt = fstDt;
		}
		while (true) {
			let row = tBody.insertRow();
			for (let i = 0; i < 7; i++) {
				let html = this.#getZeroPadded(wDt.getDate());
				let cell = this.#commonDateCell(row, html);
				cell.className = "datepicker-datecell";
				// date out of the month range;
				if (wDt.getFullYear() != dt.getFullYear() || wDt.getMonth() != dt.getMonth()) {
					cell.className = "datepicker-datecell-out";
				} else {
					cell.setAttribute("data-date", this.#getDate(wDt));
					cell.onclick = function(pad) {
						return function() {
							pad.setValue(this.getAttribute("data-date"));
							pad.hide();
						}
					}(this)
				}

				let selDay = function() {
					if (isNaN(inpDt)) return false;
					wDt.getFullYear() == inpDt.getFullYear() && wDt.getMonth() == inpDt.getMonth() && wDt.getDate() == inpDt.getDate();
				}();

				let isToday = wDt.getFullYear() == today.getFullYear() && wDt.getMonth() == today.getMonth() && wDt.getDate() == today.getDate();
				if ((selDay && this.#element.value == "") || isToday && !selDay) {
					cell.className = "datepicker-datecell-today";
				} else if (selDay) {
					cell.className = "datepicker-datecell-selected";
				}

				wDt = new Date(wDt.getFullYear(), wDt.getMonth(), wDt.getDate() + 1);
			}
			if (wDt.getFullYear() != dt.getFullYear() || wDt.getMonth() != dt.getMonth()) {
				break;
			}
		}
	}

	#commonDateCell(row, data) {
		let cell = row.insertCell()
		cell.innerHTML = data;
		cell.className = "datepicker-weekday-cell";
		cell.setAttribute("data-magic", this.#randomId);
		return cell;
	}

	#_(element, parent) {
		let ret = document.createElement(element);
		if (typeof parent == "undefined")
			parent = document.body
		parent.appendChild(ret)
		return ret;
	}

	calendar(sDate) {
		this.#parentDiv.innerHTML = "";
		let tbl = this.#_("table", this.#parentDiv);
		let caption = tbl.createCaption()
		caption.innerHTML = this.#getJapDate(sDate);
		caption.className = "datepicker_caption"
		let tHead = tbl.createTHead();
		this.#makeChangeMonth(sDate, tHead);
		let row = tHead.insertRow();
		this.#commonDateCell(row, "Sun");
		this.#commonDateCell(row, "Mon");
		this.#commonDateCell(row, "Tue");
		this.#commonDateCell(row, "Wed");
		this.#commonDateCell(row, "Thu");
		this.#commonDateCell(row, "Fri");
		this.#commonDateCell(row, "Sat");
		this.#createAllDate(tbl.createTBody(), sDate)
	}

	#makeid(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	#getZeroPadded(number) {
		return number < 10 ? "0" + number : number + "";
	}
	#getJapDate(sDate) {
		let m = this.#getZeroPadded(sDate.getMonth() + 1);
		let d = this.#getZeroPadded(sDate.getDate());
		return (sDate.getFullYear()) + "年" + m + "月" + d + "日";
	}

	#getDate(sDate) {
		let m = this.#getZeroPadded(sDate.getMonth() + 1);
		let d = this.#getZeroPadded(sDate.getDate());
		return (sDate.getFullYear()) + "-" + m + "-" + d;
	}

	#jumpToMonth(row, clsName, html, title) {
		let cell = row.insertCell();
		cell.className = clsName;
		cell.setAttribute("data-magic", this.#randomId);
		cell.innerHTML = html;
		cell.title = title;
		return cell;
	}

	#makeChangeMonth(d, thead) {
		let row = thead.insertRow();
		this.#jumpToMonth(row, 'date_jump_field', "<<", "Previous Year").onclick = function(d, obj) {
			return function() {
				obj.calendar(new Date(d.getFullYear() - 1, d.getMonth(), d.getDay()));
			}
		}(d, this);

		this.#jumpToMonth(row, "date_jump_field", "<", "Previous MOnth").onclick = function(d, obj) {
			return function() {
				obj.calendar(new Date(d.getFullYear(), d.getMonth() - 1, d.getDay()));
			}
		}(d, this);

		this.#jumpToMonth(row, "datepicker-month-cell", ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()], "Selected Month").colSpan = 3;

		this.#jumpToMonth(row, "date_jump_field", ">", "Next Month").onclick = function(d, obj) {
			return function() {
				obj.calendar(new Date(d.getFullYear(), d.getMonth() + 1, d.getDay()));
			}
		}(d, this);
		this.#jumpToMonth(row, "date_jump_field", ">>", "Next Year").onclick = function(d, obj) {
			return function() {
				obj.calendar(new Date(d.getFullYear() + 1, d.getMonth(), d.getDay()));
			}
		}(d, this);
		return row;
	}
	setValue(value) {
		this.#element.value = value;
	}
}
