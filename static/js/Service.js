var ser = angular.module('Services', []);
ser.factory('checkRem', function () {
	return {
		result: function() {
				return {
					username: localStorage.RemenberUser,
					pass: localStorage.RemenberPass
				}
			}
	}
});
ser.factory('checkLog', function () {
		return {
			check: function (user) {
				if((localStorage.RemenberPass && localStorage.RemenberUser) || user) {
					return true
				} else {
					$('#blog').attr('disabled', 'true');
					$('#Say').attr('disabled', 'true');
					return false
				}

			}
		}
});
ser.factory('MarkdownIn', function () {
	return {
		In: function () {
			/* 动态引进markdown.js */
			var script = document.createElement('script');
			script.src = "/js/lib/markdown.js";
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	}
})
