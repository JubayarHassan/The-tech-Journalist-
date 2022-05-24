<div class="oceanwp-mb-desc">
	
		<span class="butterbean-label">{{ data.label }}</span>
	

	
		<span class="butterbean-description">{{{ data.description }}}</span>
	
</div>

<div class="oceanwp-mb-field">
	<select class="widefat butterbean-multiple-select" multiple name="{{ data.field_name }}[]" data.attr>

		

			<option value="{{ choice }}" if _.indexof data.value choice> selected="selected" >{{ label }}</option>

		

	</select>
</div>