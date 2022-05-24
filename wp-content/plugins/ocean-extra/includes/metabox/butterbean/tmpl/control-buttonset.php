<div class="oceanwp-mb-desc">
	
		<span class="butterbean-label">{{ data.label }}</span>
	

	
		<span class="butterbean-description">{{{ data.description }}}</span>
	
</div>

<div class="oceanwp-mb-field">
	<ul class="butterbean-buttonset">

		

			<li>
				<input type="radio" class="buttonset-input" value="{{ key }}" name="{{ data.field_name }}" id="{{ data.field_name }}_{{ key }}" if data.value="==" key> checked="checked"  />
				<label class="buttonset-label" for="{{ data.field_name }}_{{ key }}">{{ data.choices[ key ] }}</label>
			</li>

		

	</ul>
</div>