<span class="butterbean-label">{{ data.label }}</span>



	<span class="butterbean-description">{{{ data.description }}}</span>


<ul class="butterbean-radio-list">

	

		<li>
			<label>
				<input type="radio" value="{{ choice }}" name="{{ data.field_name }}" if data.value="==" choice> checked="checked"  />
				{{ label }}
			</label>
		</li>

	

</ul>