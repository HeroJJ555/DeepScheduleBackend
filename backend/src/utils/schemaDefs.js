export const registerSchema = {
    type: 'object',
    required: ['email','password','name'],
    properties: {
      email:    { type:'string', format:'email' },
      password: { type:'string', minLength:6 },
      name:     { type:'string', minLength:1 },
      schoolId: { type:'integer' }
    },
    additionalProperties: false
  };
  
  export const loginSchema = {
    type: 'object',
    required: ['email','password'],
    properties: {
      email:    { type:'string', format:'email' },
      password: { type:'string' }
    },
    additionalProperties: false
  };
  
  export const passwordResetRequestSchema = {
    type:'object',
    required:['email'],
    properties:{ email:{ type:'string', format:'email' } },
    additionalProperties:false
  };
  
  export const passwordResetConfirmSchema = {
    type:'object',
    required:['token','newPassword'],
    properties:{
      token:       { type:'string' },
      newPassword: { type:'string', minLength:6 }
    },
    additionalProperties:false
  };
  
  export const updateUserSchema = {
    type:'object',
    properties:{
      name:     { type:'string', minLength:1 },
      password: { type:'string', minLength:6 }
    },
    additionalProperties:false
  };
  
  export const inviteSchema = {
    type:'object',
    required:['email','role','schoolId'],
    properties:{
      email:    { type:'string', format:'email' },
      role:     { type:'string', enum:['ADMIN','TEACHER'] },
      schoolId: { type:'integer' }
    },
    additionalProperties:false
  };
  
  export const createSchoolSchema = {
    type:'object',
    required:['name'],
    properties:{
      name:    { type:'string', minLength:1 },
      address: { type:'string' },
      city:    { type:'string' }
    },
    additionalProperties:false
  };
  
  export const updateSchoolSchema = {
    type:'object',
    properties:{
      name:    { type:'string', minLength:1 },
      address: { type:'string' },
      city:    { type:'string' }
    },
    additionalProperties:false
  };
  
  export const teacherSchema = {
    type:'object',
    required:['name'],
    properties:{
      name:  { type:'string', minLength:1 },
      email: { type:'string', format:'email' }
    },
    additionalProperties:false
  };
  
  export const classSchema = {
    type:'object',
    required:['name'],
    properties:{
      name:     { type:'string', minLength:1 },
      subjects: {
        type: 'array',
        items: {
          type:'object',
          required:['subjectId','hours'],
          properties:{
            subjectId:{ type:'integer' },
            hours:    { type:'integer', minimum:1 }
          },
          additionalProperties:false
        }
      }
    },
    additionalProperties:false
  };
  
  export const roomSchema = {
    type:'object',
    required:['name'],
    properties:{
      name:     { type:'string', minLength:1 },
      capacity: { type:'integer', minimum:1 }
    },
    additionalProperties:false
  };
  
  export const timeSlotSchema = {
    type:'object',
    required:['day','hour'],
    properties:{
      day:  { type:'integer', minimum:0, maximum:6 },
      hour: { type:'integer', minimum:0, maximum:23 }
    },
    additionalProperties:false
  };
  
  export const entrySchema = {
    type:'object',
    required:['classId','subjectId','timeslotId'],
    properties:{
      classId:    { type:'integer' },
      subjectId:  { type:'integer' },
      timeslotId: { type:'integer' },
      roomId:     { type:'integer' },
      teacherId:  { type:'integer' }
    },
    additionalProperties:false
  };