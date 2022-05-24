<label>

	
		<span class="butterbean-label">{{ data.label }}</span>
	

	
		<span class="butterbean-description">{{{ data.description }}}</span>
	

	<select data.attr>

		

			<option value="{{ choice }}" if choice="==" data.value> selected="selected" >{{ label }}</option>

		

		

			<optgroup label="{{ group.label }}">

				

					<option value="{{ choice }}" if choice="==" data.value> selected="selected" >{{ label }}</option>

				

			</optgroup>
		

	</select>
</label>