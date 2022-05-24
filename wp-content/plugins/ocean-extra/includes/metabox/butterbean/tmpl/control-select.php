<label>

	
		<span class="butterbean-label">{{ data.label }}</span>
	

	
		<span class="butterbean-description">{{{ data.description }}}</span>
	

	<select data.attr>

		

			<option value="{{ choice }}" if data.value="==" choice> selected="selected" >{{ label }}</option>

		

	</select>
</label>