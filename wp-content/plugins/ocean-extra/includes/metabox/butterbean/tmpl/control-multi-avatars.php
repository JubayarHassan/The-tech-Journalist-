<span class="butterbean-label">{{ data.label }}</span>



	<span class="butterbean-description">{{{ data.description }}}</span>


<div class="butterbean-multi-avatars-wrap">

	

		<label>
			<input type="checkbox" value="{{ user.id }}" name="{{ data.field_name }}[]" if _.indexof data.value user.id> checked="checked"  />

			<span class="screen-reader-text">{{ user.name }}</span>

			{{{ user.avatar }}}
		</label>

	

</div>
<!-- .butterbean-multi-avatars-wrap -->