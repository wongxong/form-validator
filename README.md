# form-validator

```
	<form class="form-register">
		...
		<div data-prop="name">
			<label>用户名</label>
			<div class="group-content">
				<input type="text" data-field="name" name="name" value="">
			</div>
		</div>
		<div data-prop="tel">
			<label>手机号</label>
			<div class="group-content">
				<input type="tel" data-field="tel" data-trigger="custom-event" name="tel" value="">
			</div>
		</div>
	</form>
	// 验证规则
	var rules = {
		name: [
			{ required: true, message: "用户名不能为空" },
			{
				validator: function(rule, value, callback) {
					if (value.length < 5) {
						callback(new Error("用户名不能少于5个字符"));
					} else {
						callback();
					}
				}
			}
		],
		tel: [
			{ required: true, message: "手机号不能为空" },
			{
				validator: function(rule, value, callback) {
					if (/^1\d{10}$/.test(value)) {
						callback();
					} else {
						callback(new Error("手机号格式不正确"));
					}
				}
			}
		]
		...
	};
	// 验证配置项
	var options = {
		// 禁用表单提交
		preventSubmit: true,
		// 错误提示的元素的classname，暂不支持多个
		errorClass: "group-content__error",
		// 错误提示的父级元素选择器，一般是 classname，用于 append 错误提示元素
		errorParentClass: 'group-content'
	};

	// 初始化验证
	var validator = new Validator('.form-register', rules, options);

	// 通过 data-trigger="custom-event" 自定义设置校验事件

	// 验证上面表单已注册的属性
	validator.validate(function(valid) {
		// 验证通过
		if (valid) {
			...
		}
	});

	// 验证指定属性
	validator.validate("name", function(valid) {
		...
	});

	// 清空所有错误验证
	validator.clearValidate();

	// 清空指定错误验证
	validator.clearValidate("name");
	validator.clearValidate(["name", "tel"]);

	// 销毁验证绑定
	validator.destroy();
```
