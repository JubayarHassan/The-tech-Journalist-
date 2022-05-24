<span class="butterbean-label">{{ data.label }}</span>



	<span class="butterbean-description">{{{ data.description }}}</span>



	<label aria-selected="{{ palette.selected }}">
		<input type="radio" value="{{ choice }}" name="{{ data.field_name }}" if palette.selected> checked="checked"  />

		<span class="butterbean-palette-label">{{ palette.label }}</span>

		<div class="butterbean-palette-block">

			
				<span class="butterbean-palette-color" style="background-color: {{ color }}">&nbsp;</span>
			

		</div>
	</label>