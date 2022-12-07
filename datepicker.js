function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
function getJapDate(sDate) {
	let m = sDate.getMonth() < 9 ? "0" + (sDate.getMonth() + 1) : (sDate.getMonth() + 1);
	let d = sDate.getDate() < 10 ? "0" + sDate.getDate() : sDate.getDate();
	return (sDate.getFullYear()) + "年" + m + "月" + d + "日";
}

function getDate(sDate) {
	let m = sDate.getMonth() < 9 ? "0" + (sDate.getMonth() + 1) : (sDate.getMonth() + 1);
	let d = sDate.getDate() < 10 ? "0" + sDate.getDate() : sDate.getDate();
	return (sDate.getFullYear()) + "-" + m + "-" + d;
}

var datepicker = function(element) {
	if (typeof element == "string") throw "have to be element";
	const CELL_WIDTH = "20px";
	const FONT_SIZE = "x-small";
	const DIV_BACKGROUND = "#afafaf";
	const ELEMENT_BORDER = "1px solid #ff8989";
	const DATE_BORDER = "1px solid gold";
	const DATE_TITLE_BACKGROUND = "#78c0bc";
	const DATE_OUT_MONTH_BACKGROUND = "#949494";
	const DATE_IN_MONTH_BACKGROUND = "#ffffff";
	const DATE_TODAY_BACKGROUND = "#a4d4d4";
	const DATE_SELECTED_BACKGROUND = "#446444";
	const CAPTION_BACKGROUND = "#faaf30"
	const DATE_CELL_PADDING = "4px";
	// (CELL_WIDTH + DATE_CELL_PADDING * 2 + (BORDER=1)*2 + (DEFAULT_CEL_SPACING=2))* (COL_COUNT=7) + DEFAULT_CEL_SPACING
	const DIV_WIDTH = "226px"


	///////////////////////////////////////////
	function makeChangeMonth(d, thead, pd, el) {
		let fn = function() {
			let cell = row.insertCell()
			cell.style.border = DATE_BORDER;
			cell.style.padding = "4px";
			cell.style.textAlign = "center";
			cell.style.borderRadius = "5px"
			cell.style.cursor = "pointer";
			cell.style.fontSize = FONT_SIZE;
			cell.style.background = DIV_BACKGROUND;
			cell.setAttribute("data-magic", pd.id);
			return cell;
		}
		let row = thead.insertRow();
		let cell1 = fn();
		cell1.innerHTML = "<<";
		cell1.title = "1 year ago";
		cell1.onclick = function(d, pd, el) {
			return function() {
				calendar(new Date(d.getFullYear() - 1, d.getMonth(), d.getDay()), pd, el);
			}
		}(d, pd, el);
		let cell2 = fn();
		cell2.innerHTML = "<";
		cell2.title = "1 month ago";
		cell2.onclick = function(d, pd, el) {
			return function() {
				calendar(new Date(d.getFullYear(), d.getMonth() - 1, d.getDay()), pd, el);
			}
		}(d, pd, el);
		let cell3 = fn();
		cell3.innerHTML = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()];
		cell3.title = "Selected Month";
		cell3.colSpan = 3;
		cell3.style.cursor = "default";
		cell3.style.background = CAPTION_BACKGROUND;
		let cell4 = fn();
		cell4.innerHTML = ">";
		cell4.title = "1 month later";
		cell4.onclick = function(d, pd, el) {
			return function() {
				calendar(new Date(d.getFullYear(), d.getMonth() + 1, d.getDay()), pd, el);
			}
		}(d, pd, el);

		let cell5 = fn();
		cell5.innerHTML = ">>";
		cell5.title = "1 year later";
		cell5.onclick = function(d, pd, el) {
			return function() {
				calendar(new Date(d.getFullYear() + 1, d.getMonth(), d.getDay()), pd, el);
			}
		}(d, pd, el);
		return row;
	}

	function commonDateCell(row, data, background, cursor, pd) {
		let cell = row.insertCell()
		cell.innerHTML = data;
		cell.style.height = CELL_WIDTH;
		cell.style.width = CELL_WIDTH;
		cell.style.border = DATE_BORDER;
		cell.style.padding = DATE_CELL_PADDING;
		cell.style.textAlign = "center";
		cell.style.borderRadius = "5px"
		cell.style.cursor = cursor;
		cell.style.fontSize = FONT_SIZE;
		cell.style.background = background;
		cell.setAttribute("data-magic", pd.id);
		return cell;
	}

	function createAllDate(tBody, date, pd, el) {
		let elmDate = new Date(el);
		let today = new Date();
		let firstDate = new Date(date.getFullYear(), date.getMonth());
		let workDate;
		if (firstDate.getDay() != 0) {
			workDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDay() - 7);
		} else {
			workDate = firstDate;
		}
		while (true) {
			let row = tBody.insertRow();
			for (let i = 0; i < 7; i++) {
				let html = workDate.getDate() < 10 ? "0" + workDate.getDate() : workDate.getDate() + ""
				cell = commonDateCell(row, html, DATE_IN_MONTH_BACKGROUND, "pointer", pd)
				// date out of the month range;
				if (workDate.getFullYear() != date.getFullYear() || workDate.getMonth() != date.getMonth()) {
					cell.style.verticalAlign = "bottom";
					cell.style.textAlign = "right";
					cell.style.background = DATE_OUT_MONTH_BACKGROUND;
					cell.style.cursor = "default";
				} else {
					cell.setAttribute("data-date", getDate(workDate));
					cell.onclick = function(pad, elm) {
						return function() {
							elm.value = this.getAttribute("data-date");
							pad.style.display = "none";
						}
					}(pd, el)
				}

				let selDay = function() {
					if (isNaN(elmDate)) return false;
					workDate.getFullYear() == elmDate.getFullYear() && workDate.getMonth() == elmDate.getMonth() && workDate.getDate() == elmDate.getDate();
				}();

				let isToday = workDate.getFullYear() == today.getFullYear() && workDate.getMonth() == today.getMonth() && workDate.getDate() == today.getDate();
				if ((selDay && el.value == "") || isToday && !selDay) {
					cell.style.background = DATE_TODAY_BACKGROUND;
				} else if (selDay) {
					cell.style.background = DATE_SELECTED_BACKGROUND;
				}

				workDate = new Date(workDate.getFullYear(), workDate.getMonth(), workDate.getDate() + 1);
			}
			if (workDate.getFullYear() != date.getFullYear() || workDate.getMonth() != date.getMonth()) {
				break;
			}
		}
	}

	var calendar = function(sDate, pd, el) {
		pd.innerHTML = "";
		let tbl = E("table", pd);
		let caption = tbl.createCaption()
		caption.innerHTML = getJapDate(sDate);
		caption.style.fontSize = FONT_SIZE;
		caption.style.background = CAPTION_BACKGROUND;
		let tHead = tbl.createTHead();
		makeChangeMonth(sDate, tHead, pd, el);
		let row = tHead.insertRow();
		commonDateCell(row, "Sun", DATE_TITLE_BACKGROUND, "default", pd);
		commonDateCell(row, "Mon", DATE_TITLE_BACKGROUND, "default", pd);
		commonDateCell(row, "Tue", DATE_TITLE_BACKGROUND, "default", pd);
		commonDateCell(row, "Wed", DATE_TITLE_BACKGROUND, "default", pd);
		commonDateCell(row, "Thu", DATE_TITLE_BACKGROUND, "default", pd);
		commonDateCell(row, "Fri", DATE_TITLE_BACKGROUND, "default", pd);
		commonDateCell(row, "Sat", DATE_TITLE_BACKGROUND, "default", pd);
		let tBody = tbl.createTBody();
		createAllDate(tBody, sDate, pd, el)
	}

	/////////////////////////////////////////////
	let randomId = "div-id-" + makeid(10);
	element.setAttribute("data-magic", randomId);
	element.style.textAlign = "center";
	element.style.background = "#afafaf";
	let E = function(el, m) {
		let ret = document.createElement(el);
		if (typeof m == "undefined")
			m = document.body
		m.appendChild(ret)
		return ret;
	}

	let parentDiv = E("DIV");
	parentDiv.id = randomId
	element.style.width = DIV_WIDTH;
	element.style.border = ELEMENT_BORDER;
	element.style.borderRadius = "5px";
	element.style.height = "25px";
	element.readOnly = true;


	var rect = element.getBoundingClientRect();
	parentDiv.style.position = "absolute";
	parentDiv.style.left = rect.left;
	parentDiv.style.top = (parseInt(rect.bottom) + 2) + "px";
	parentDiv.style.border = DATE_BORDER;
	parentDiv.style.display = "none";
	parentDiv.style.background = DIV_BACKGROUND;

	element.onfocus = function(pd) {
		return function() {
			if (pd.style.display == "none") {
				pd.style.display = "block";
				let date = new Date(this.value);
				calendar(isNaN(date) ? new Date() : date, pd, this);
			} else {
				pd.style.display = "none";
			}
		}
	}(parentDiv);
	document.addEventListener("click", function(pd) {
		return function(e) {
			if (e.target.getAttribute("data-magic") != pd.id) {
				pd.style.display = "none";
			}
		}
	}(parentDiv));
}
