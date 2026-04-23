import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { 
  Heart, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  ChevronRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  streetAddress: z.string().min(2, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  gender: z.enum(["male", "female", "other"]),
  ageRange: z.string().min(1, "Please select an age range"),
  decisions: z.array(z.string()).default([]),
  nextSteps: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const ageRanges = [
  "16-20", "21-25", "26-30", "31-35", "36-40", 
  "41-45", "46-50", "51-55", "56-60", "61-65", "66+"
];

const decisionOptions = [
  { id: "commit", label: "Commit life to Christ" },
  { id: "baptized", label: "Want to be baptized" },
  { id: "guest1", label: "1st time guest" },
  { id: "guest2", label: "2nd time" },
  { id: "guest3", label: "3rd time" },
  { id: "membership", label: "Membership" },
];

const nextStepOptions = [
  { id: "m101", label: "Membership 101" },
  { id: "p201", label: "Discover Purpose 201" },
  { id: "l301", label: "Leadership 301" },
  { id: "s401", label: "Serve 401" },
];

export default function App() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      gender: "male",
      ageRange: "",
      decisions: [],
      nextSteps: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const connectCardsRef = collection(db, 'connectCards');
      await addDoc(connectCardsRef, {
        ...data,
        createdAt: serverTimestamp()
      });

      toast.success("Thank you for connecting with us!", {
        description: "We've received your card and will reach out soon.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting card:", error);
      toast.error("Submitting card failed", {
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8 px-4 font-sans text-slate-900">
      <Toaster position="top-center" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1000px] w-full bg-white shadow-2xl rounded-xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-slate-800 text-white px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
            <div className="text-center md:text-left transition-all">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 uppercase">Neema Gospel Church</h1>
              <p className="text-slate-400 font-medium italic text-lg">Welcome Home.</p>
              <p className="text-slate-500 text-sm">We are honored to have you with us.</p>
            </div>
          </div>
          <div className="text-right border-l-2 border-slate-600 pl-6 hidden md:block">
            <h2 className="text-2xl font-semibold opacity-90">CONNECT CARD</h2>
            <p className="text-xs text-slate-400 tracking-widest uppercase">Visitor & Member Registration</p>
          </div>
        </div>

        {/* Connect Card Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-10 p-6 md:p-10">
            
            {/* Left Column: Personal Information (7 units) */}
            <div className="md:col-span-7 space-y-8">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-800 text-white rounded-full text-[10px]">01</span>
                  Personal Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 md:col-span-1">
                  <Label htmlFor="firstName" className="text-[10px] font-bold text-slate-500 uppercase">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    {...form.register("firstName")}
                    className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1 md:col-span-1">
                  <Label htmlFor="lastName" className="text-[10px] font-bold text-slate-500 uppercase">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    {...form.register("lastName")}
                    className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    {...form.register("email")}
                    className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                  />
                  {form.formState.errors.email && (
                    <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="(123) 456-7890" 
                    {...form.register("phone")}
                    className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="streetAddress" className="text-[10px] font-bold text-slate-500 uppercase">Street Address</Label>
                  <Input 
                    id="streetAddress" 
                    placeholder="123 Grace Lane" 
                    {...form.register("streetAddress")}
                    className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                  />
                  {form.formState.errors.streetAddress && (
                    <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.streetAddress.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="city" className="text-[10px] font-bold text-slate-500 uppercase">City</Label>
                  <Input 
                    id="city" 
                    placeholder="Faith City" 
                    {...form.register("city")}
                    className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                  />
                  {form.formState.errors.city && (
                    <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.city.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="state" className="text-[10px] font-bold text-slate-500 uppercase">State</Label>
                    <Input 
                      id="state" 
                      placeholder="TX" 
                      {...form.register("state")}
                      className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                    />
                    {form.formState.errors.state && (
                      <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.state.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="zipCode" className="text-[10px] font-bold text-slate-500 uppercase">Zip Code</Label>
                    <Input 
                      id="zipCode" 
                      placeholder="77001" 
                      {...form.register("zipCode")}
                      className="bg-slate-50 border-slate-200 rounded text-sm focus:ring-1 focus:ring-slate-400"
                    />
                    {form.formState.errors.zipCode && (
                      <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender</Label>
                  <RadioGroup 
                    defaultValue="male" 
                    className="flex gap-6"
                    onValueChange={(val) => form.setValue("gender", val as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" className="border-slate-300" />
                      <Label htmlFor="male" className="text-sm font-medium cursor-pointer">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" className="border-slate-300" />
                      <Label htmlFor="female" className="text-sm font-medium cursor-pointer">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Age Bracket</Label>
                  <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                    {ageRanges.map((range) => (
                      <label key={range} className="flex items-center text-[11px] font-medium cursor-pointer group">
                        <input 
                          type="radio" 
                          name="ageSelect"
                          value={range}
                          onChange={(e) => form.setValue("ageRange", e.target.value)}
                          className="mr-1.5 w-3.5 h-3.5 border-slate-300 rounded-full"
                          checked={form.watch("ageRange") === range}
                        /> 
                        <span className="group-hover:text-slate-600 transition-colors">{range}</span>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.ageRange && (
                    <p className="text-[10px] text-destructive font-semibold uppercase tracking-tighter">{form.formState.errors.ageRange.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Decisions & Steps (5 units) */}
            <div className="md:col-span-5 space-y-8 bg-slate-50 p-6 rounded-lg border border-slate-100">
              
              <section className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                     <span className="w-5 h-5 flex items-center justify-center bg-slate-400 text-white rounded-full text-[10px]">02</span>
                     Decision Today
                  </h3>
                </div>
                <div className="space-y-3">
                  {decisionOptions.map((option) => (
                    <label key={option.id} className="flex items-start text-sm group cursor-pointer group">
                      <Checkbox 
                        id={option.id} 
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-800"
                        onCheckedChange={(checked) => {
                          const current = form.getValues("decisions");
                          if (checked) {
                            form.setValue("decisions", [...current, option.label]);
                          } else {
                            form.setValue("decisions", current.filter(d => d !== option.label));
                          }
                        }}
                      />
                      <span className="ml-3 text-slate-700 group-hover:text-slate-900 transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-slate-400 text-white rounded-full text-[10px]">03</span>
                    Next Steps
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {nextStepOptions.map((option) => (
                    <label key={option.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded shadow-sm hover:border-slate-300 cursor-pointer transition-all active:scale-[0.98]">
                      <div>
                        <span className="text-sm font-semibold block">{option.label}</span>
                        <span className="text-[10px] text-slate-400">
                          {option.id === 'm101' && "Our foundation and values"}
                          {option.id === 'p201' && "Find your unique design"}
                          {option.id === 'l301' && "Growing as a godly leader"}
                          {option.id === 's401' && "Joining the Dream Team"}
                        </span>
                      </div>
                      <Checkbox 
                        className="w-5 h-5"
                        onCheckedChange={(checked) => {
                          const current = form.getValues("nextSteps");
                          if (checked) {
                            form.setValue("nextSteps", [...current, option.label]);
                          } else {
                            form.setValue("nextSteps", current.filter(d => d !== option.label));
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Footer / Submit */}
          <div className="p-8 md:p-12 border-t border-slate-100 flex flex-col items-center bg-white gap-8">
            <div className="flex flex-col items-center gap-6 w-full max-w-sm">
              <Button 
                type="submit" 
                className="w-full bg-slate-800 text-white font-bold uppercase tracking-widest py-7 px-12 rounded hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Submit Connect Card"}
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 max-w-lg leading-relaxed text-center">
              Please turn this card in at the Connect Center or drop it in the offering bucket as you exit. We have a special gift waiting for our first-time guests! Romans 15:7
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );

}


