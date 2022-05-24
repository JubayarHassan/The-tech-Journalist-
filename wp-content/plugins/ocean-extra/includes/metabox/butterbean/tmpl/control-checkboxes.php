<span class="butterbean-label">{{ data.label }}</span>



	<span class="butterbean-description">{{{ data.description }}}</span>


<ul class="butterbean-checkbox-list">

	

		<li>
			<label>
				<input type="checkbox" value="{{ choice }}" name="{{ data.field_name }}[]" if _.indexof data.value choice> checked="checked"  />
				{{ label }}
			</label>
		</li>

	

</ul>