"use client";

import React from "react";
import { z } from "zod";
import { userService } from "../../services/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useState } from "react";


import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/forms/formid";

import { Input } from "@/components/forms/input";
import { Button } from "@/components/forms/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/forms/select";

import uploadIcon from "@/assets/group01.svg";

const RequiredLabel = ({ children }) => (
  <FormLabel className="font-medium">
    {children}
    <span className="text-red-500 ml-1">*</span>
  </FormLabel>
);

// Validation schema
const formSchema = z
  .object({
    role: z.string({ required_error: "Please select a role." }),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(10, "Enter a valid phone number"),
    idNo: z.string().min(4, "ID number is required"),
    unit: z.string().min(1, "Unit is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    photo: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export function UserForm({ title = "User Registration", submitLabel = "Submit", setUsers }) {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      idNo: "",
      unit: "",
      password: "",
      confirmPassword: "",
      photo: null,
    },
  });

    const onSubmit = async (values) => {
      try {
        const formData = new FormData();
        formData.append("first_name", values.firstName);
        formData.append("last_name", values.lastName);
        formData.append("email", values.email);
        formData.append("phone_number", values.phone);
        formData.append("id_number", values.idNo);
        formData.append("unit_number", values.unit);
        formData.append("role", values.role);
        formData.append("password", values.password);
        if (values.photo) {
          formData.append("profile_picture", values.photo);
        }

        const addedUser = await userService.addUser(formData);

        // Optionally refresh user list
        if (setUsers) {
          setUsers((prev) => [...prev, addedUser]);
        }

        form.reset();
        navigate("/userspage");
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add user. Please try again.");
      }
  };


  return (
    <div className="min-h-screen bg-[#EEEAFD]">
      <Layout>
        <div className="p-4 md:p-6 flex justify-center">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg w-full max-w-4xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">{title}</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Role</RequiredLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#f4eaff]">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tenant">Resident</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {["firstName", "lastName", "email"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>
                            {name === "firstName"
                              ? "First Name"
                              : name === "lastName"
                              ? "Last Name"
                              : "Email"}
                          </RequiredLabel>
                          <FormControl>
                            <Input
                              className="bg-[#f4eaff] placeholder-gray-600"
                              placeholder={`Enter ${name}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {/* Phone, ID, Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {["phone", "idNo", "unit"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>
                            {name === "phone"
                              ? "Phone No."
                              : name === "idNo"
                              ? "ID No."
                              : "Unit"}
                          </RequiredLabel>
                          <FormControl>
                            <Input
                              className="bg-[#f4eaff] placeholder-gray-600"
                              placeholder={`Enter ${name}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["password", "confirmPassword"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <RequiredLabel>
                            {name === "password" ? "Password" : "Confirm Password"}
                          </RequiredLabel>
                          <FormControl>
                            <Input
                              className="bg-[#f4eaff] placeholder-gray-600"
                              type="password"
                              placeholder={`Enter ${name}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <FormField
  control={form.control}
  name="photo"
  render={({ field: { onChange, value } }) => {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        onChange(file); // update react-hook-form value
      }
    };

    return (
      <FormItem>
        <FormLabel className="font-medium">Photo</FormLabel>
        <FormControl>
          <div className="bg-[#f4eaff] h-28 rounded-md border border-dashed flex items-center justify-center text-sm text-gray-500 relative overflow-hidden">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="opacity-0 absolute w-full h-full cursor-pointer"
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-[#085ca10d] rounded-full p-2 w-12 h-12 flex items-center justify-center">
                  <img src={uploadIcon} alt="Upload" className="w-6 h-6" />
                </div>
                <span className="text-sm text-gray-500 text-center">
                  Upload a User’s Photo
                </span>
              </div>
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>


                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-[#005E0E] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-600 text-white font-semibold py-2 rounded-md shadow-md transition-all duration-300"
                >
                  {submitLabel}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Layout>
    </div>
  );
}
