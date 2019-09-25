
precision mediump float;

// Built-in attributes
attribute vec4 a_position;
attribute vec2 a_texCoord; 
attribute vec2 a_meshCoord; 

// Built-in uniforms. 
uniform mat4 u_projectionMatrix;
uniform vec2 u_textureSize; 

// Uniforms passed-in from CSS 
uniform mat4 transformFrontUp;	
uniform mat4 transformFrontDn;	
uniform mat4 transformBack;	
uniform float useColoredBack; 
uniform float shadow; 

// Varyings 
varying float v_lighting; 
varying float v_shadow;

// Constants 
const float PI = 3.1415629; 

// Helper functions 
float rad(float deg) { 	return deg * PI / 180.0; } 

mat4 rotate_X(float p) {	//rotation x-axis
 
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, cos(rad(p)), -sin(rad(p)), 0.0,
        0.0, sin(rad(p)), cos(rad(p)), 0.0,
        0.0, 0.0, 0.0, 1.0);
}


mat4 rotate_Z(float p) {	//rotation x-axis
 
    return mat4(
        cos(rad(p)), -sin(rad(p)), 0.0, 0.0,
        sin(rad(p)), cos(rad(p)), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0);
}

mat4 perspective(float p) {
    float perspective = - 1.0 / p;
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, perspective,
        0.0, 0.0, 0.0, 1.0);
}

mat4 scale(float p) {
   
    return mat4(
        p, 0.0, 0.0, 0.0,
        0.0, p, 0.0, 0.0,
        0.0, 0.0, p, 0.0,
        0.0, 0.0, 0.0, 1.0);
}

void main(){
    vec4 pos = a_position;
	
	float oneSixth = 0.166667; 
	float oneThird = 0.3333333; 
	
	//Indicates it's cover or article
	float isCover = 0.0;
	
	
	if (pos.y > oneSixth) {   
		pos.y -= oneSixth;
		pos = transformFrontDn * pos;
		pos.y += oneSixth;
		
		gl_Position = u_projectionMatrix * scale(0.7) * pos;
		
		v_shadow = min(1.0, 1.0-(pow(useColoredBack,2.0)*0.2));
		
    } else if (pos.y < -oneSixth){
        pos.y += oneSixth;
		pos = transformBack * pos;
		pos.y -= oneSixth;		
		
		pos.y -= oneSixth;
		pos = transformFrontUp * pos;
		pos.y += oneSixth;
		
		gl_Position = u_projectionMatrix * scale(0.7) * pos;
		
		v_shadow = 1.0; 		//no shadowing
		
		isCover = 1.0;			//this is cover section
		
    }
	else{
		pos.y -= oneSixth;
		pos = transformFrontUp * pos;
		pos.y += oneSixth;
		
		gl_Position = u_projectionMatrix * scale(0.7) * pos;
		
		v_shadow = min(1.0, 1.0-(pow(useColoredBack,2.0)*0.2));
    }	
	
	//lighting effect
	
	if (isCover == 1.0){
		v_shadow = 1.0; 		//no shadowing
		v_lighting = 1.0;
	}
	else{
		v_lighting = min(1.0,(cos(((a_meshCoord.y) + oneThird) * PI * 3.0)) + shadow); 
	}		
}