precision mediump float;

//Uniforms passed in from css
uniform float useColoredBack; 

// Varyings 
varying float v_lighting; 
varying float v_shadow;


void main()
{
	vec4 backColor = vec4(0.5, 0.5, 0.5, 1.0); 

	if (gl_FrontFacing && useColoredBack <= 1.0) {
		//Blending : Black (0,0,0) & Opacity : 1.0 - v_lighting
		css_MixColor = vec4(0, 0, 0, 1.0 - v_lighting);
    				
			css_ColorMatrix = mat4(v_shadow, 0, 0, 0,
									0, v_shadow, 0, 0,
									0, 0, v_shadow, 0,
									0, 0, 0, 1);
	
		
	}

}
