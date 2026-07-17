import { Schema, model, Document } from "mongoose";

export enum DemoStatus {
  New = "New",
  Contacted = "Contacted",
  Converted = "Converted",
}

export interface IDemoLead extends Document {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  chessExperience: string;
  preferredTime: string;
  message?: string;
  status: DemoStatus;
  createdAt: Date;
  updatedAt: Date;
}

const DemoLeadSchema = new Schema<IDemoLead>(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },
    parentName: {
      type: String,
      required: [true, "Parent name is required"],
      trim: true,
      maxlength: [100, "Parent name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian phone number"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [4, "Minimum age is 4"],
      max: [18, "Maximum age is 18"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City name cannot exceed 100 characters"],
    },
    chessExperience: {
      type: String,
      required: [true, "Chess experience is required"],
      enum: {
        values: ["None", "Beginner", "Intermediate", "Advanced"],
        message: "Chess experience must be one of: None, Beginner, Intermediate, Advanced",
      },
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
      trim: true,
      maxlength: [100, "Preferred time cannot exceed 100 characters"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: Object.values(DemoStatus),
      default: DemoStatus.New,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for faster queries
DemoLeadSchema.index({ email: 1 });
DemoLeadSchema.index({ status: 1 });
DemoLeadSchema.index({ createdAt: -1 });

export const DemoLead = model<IDemoLead>("DemoLead", DemoLeadSchema);
