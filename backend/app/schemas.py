from pydantic import BaseModel, EmailStr, constr


class SignupSchema(BaseModel):
    name: constr(min_length=2)
    email: EmailStr
    phone: constr(min_length=10, max_length=15)
    password: constr(min_length=6, max_length=72)


class LoginSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=6)


class EmailSchema(BaseModel):
    email: EmailStr
