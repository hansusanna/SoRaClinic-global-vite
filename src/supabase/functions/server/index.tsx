import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods - MUST BE FIRST
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 86400,
    credentials: false,
  }),
);

// Add request logging middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const url = c.req.url;
  const path = new URL(url).pathname;
  
  console.log(`→ ${method} ${path}`);
  
  await next();
  
  const ms = Date.now() - start;
  console.log(`← ${method} ${path} ${c.res.status} (${ms}ms)`);
});

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// OPTIONS handler for preflight requests
app.options("*", (c) => {
  console.log("OPTIONS preflight request:", c.req.url);
  return new Response(null, { status: 204 });
});

// ========================================
// PUBLIC ENDPOINTS - NO AUTHENTICATION
// ========================================

// Health check endpoint - ALWAYS PUBLIC
app.get("/make-server-3336005e/health", (c) => {
  console.log("✅ PUBLIC Health check requested");
  return c.json({ 
    status: "ok", 
    service: "SoRa Clinic API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    public: true,
    authenticated: false
  });
});

// Test Supabase connection - ALWAYS PUBLIC  
app.get("/make-server-3336005e/test", async (c) => {
  try {
    console.log("✅ PUBLIC Connection test requested");
    
    // Test KV store
    const testKey = `test_${Date.now()}`;
    await kv.set(testKey, "connection successful");
    const testValue = await kv.get(testKey);
    
    // Clean up test data
    await kv.del(testKey);
    
    return c.json({ 
      status: "success", 
      supabase: "connected",
      kv_store: testValue,
      timestamp: new Date().toISOString(),
      server: "SoRa Clinic API Server",
      public: true,
      authenticated: false
    });
  } catch (error) {
    console.error("❌ PUBLIC Connection test failed:", error);
    return c.json({ 
      status: "error", 
      message: error.message,
      timestamp: new Date().toISOString(),
      public: true
    }, 500);
  }
});

// Submit booking appointment - PUBLIC
app.post("/make-server-3336005e/bookings", async (c) => {
  try {
    console.log("✅ PUBLIC Booking submission");
    const booking = await c.req.json();
    
    // Validate required fields
    if (!booking.name || !booking.email || !booking.phone || !booking.service || !booking.date || !booking.time) {
      return c.json({ 
        status: "error", 
        message: "Missing required fields" 
      }, 400);
    }

    // Create booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store booking in KV store
    const bookingData = {
      id: bookingId,
      ...booking,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(bookingId, bookingData);
    
    // Also store in a bookings list for easy retrieval
    const existingBookings = await kv.get("all_bookings") || [];
    existingBookings.push(bookingId);
    await kv.set("all_bookings", existingBookings);

    console.log(`New booking created: ${bookingId} for ${booking.name}`);
    
    return c.json({ 
      status: "success", 
      message: "Booking submitted successfully",
      bookingId: bookingId
    });
  } catch (error) {
    console.error("Booking submission error:", error);
    return c.json({ 
      status: "error", 
      message: "Failed to submit booking" 
    }, 500);
  }
});

// Get all bookings - PUBLIC (for now, could be restricted later)
app.get("/make-server-3336005e/bookings", async (c) => {
  try {
    console.log("✅ PUBLIC Get all bookings");
    const bookingIds = await kv.get("all_bookings") || [];
    const bookings = [];
    
    for (const id of bookingIds) {
      const booking = await kv.get(id);
      if (booking) {
        bookings.push(booking);
      }
    }
    
    return c.json({ 
      status: "success", 
      bookings: bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ 
      status: "error", 
      message: "Failed to fetch bookings" 
    }, 500);
  }
});

// Get booking by ID - PUBLIC
app.get("/make-server-3336005e/bookings/:id", async (c) => {
  try {
    const bookingId = c.req.param("id");
    const booking = await kv.get(bookingId);
    
    if (!booking) {
      return c.json({ 
        status: "error", 
        message: "Booking not found" 
      }, 404);
    }
    
    return c.json({ 
      status: "success", 
      booking: booking
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return c.json({ 
      status: "error", 
      message: "Failed to fetch booking" 
    }, 500);
  }
});

// Update booking status - PUBLIC
app.put("/make-server-3336005e/bookings/:id", async (c) => {
  try {
    const bookingId = c.req.param("id");
    const updates = await c.req.json();
    
    const existingBooking = await kv.get(bookingId);
    if (!existingBooking) {
      return c.json({ 
        status: "error", 
        message: "Booking not found" 
      }, 404);
    }
    
    const updatedBooking = {
      ...existingBooking,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(bookingId, updatedBooking);
    
    return c.json({ 
      status: "success", 
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return c.json({ 
      status: "error", 
      message: "Failed to update booking" 
    }, 500);
  }
});

// Contact form submission - PUBLIC
app.post("/make-server-3336005e/contact", async (c) => {
  try {
    console.log("✅ PUBLIC Contact form submission");
    const contact = await c.req.json();
    
    // Validate required fields
    if (!contact.name || !contact.email || !contact.message) {
      return c.json({ 
        status: "error", 
        message: "Missing required fields" 
      }, 400);
    }

    // Create contact ID
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store contact message in KV store
    const contactData = {
      id: contactId,
      ...contact,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(contactId, contactData);
    
    // Also store in a contacts list for easy retrieval
    const existingContacts = await kv.get("all_contacts") || [];
    existingContacts.push(contactId);
    await kv.set("all_contacts", existingContacts);

    console.log(`New contact message: ${contactId} from ${contact.name}`);
    
    return c.json({ 
      status: "success", 
      message: "Contact message sent successfully",
      contactId: contactId
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return c.json({ 
      status: "error", 
      message: "Failed to send message" 
    }, 500);
  }
});

// ========================================
// ADMIN AUTHENTICATION & PROTECTED ROUTES
// ========================================

// Admin login - PUBLIC (but creates session)
app.post("/make-server-3336005e/admin/login", async (c) => {
  try {
    console.log("✅ PUBLIC Admin login attempt received");
    
    const requestBody = await c.req.json();
    console.log("Request body:", { username: requestBody.username, hasPassword: !!requestBody.password });
    
    const { username, password } = requestBody;
    
    if (!username || !password) {
      console.log("Missing username or password");
      return c.json({ 
        status: "error", 
        message: "Username and password are required" 
      }, 400);
    }
    
    // Simple admin credentials (in production, use proper authentication)
    const adminUsername = Deno.env.get('ADMIN_USERNAME') || 'admin';
    const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'sora2024!';
    
    console.log("Expected credentials:", { 
      adminUsername, 
      providedUsername: username,
      passwordMatch: password === adminPassword 
    });
    
    if (username === adminUsername && password === adminPassword) {
      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      
      console.log("Login successful, generating token:", token.substring(0, 20) + "...");
      
      // Store admin session
      const sessionData = {
        username,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      await kv.set(`admin_session_${token}`, sessionData);
      console.log("Session stored successfully");
      
      return c.json({ 
        status: "success", 
        token,
        message: "Login successful"
      });
    } else {
      console.log("Invalid credentials provided");
      return c.json({ 
        status: "error", 
        message: "Invalid username or password" 
      }, 401);
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return c.json({ 
      status: "error", 
      message: `Login failed: ${error.message}` 
    }, 500);
  }
});

// Admin middleware for protected routes
async function adminAuth(c, next) {
  try {
    console.log("🔐 Admin auth middleware triggered for:", new URL(c.req.url).pathname);
    const authHeader = c.req.header('Authorization');
    console.log("Auth header:", authHeader ? `${authHeader.substring(0, 20)}...` : 'none');
    
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log("❌ No token provided");
      return c.json({ 
        code: 401,
        status: "error", 
        message: "Missing authorization header" 
      }, 401);
    }
    
    console.log("Checking session for token:", token.substring(0, 20) + "...");
    const session = await kv.get(`admin_session_${token}`);
    
    if (!session) {
      console.log("❌ Session not found for token");
      return c.json({ 
        code: 401,
        status: "error", 
        message: "Invalid token" 
      }, 401);
    }
    
    const now = new Date();
    const expiry = new Date(session.expiresAt);
    console.log("Session found, checking expiry:", { now: now.toISOString(), expiry: expiry.toISOString() });
    
    if (now > expiry) {
      console.log("❌ Session expired");
      await kv.del(`admin_session_${token}`); // Clean up expired session
      return c.json({ 
        code: 401,
        status: "error", 
        message: "Token expired" 
      }, 401);
    }
    
    console.log("✅ Admin auth successful");
    await next();
  } catch (error) {
    console.error("❌ Admin auth error:", error);
    return c.json({ 
      code: 500,
      status: "error", 
      message: "Authentication error" 
    }, 500);
  }
}

// ========================================
// PROTECTED ADMIN ROUTES - REQUIRE AUTH
// ========================================

// Events CRUD - PROTECTED
app.get("/make-server-3336005e/admin/events", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin events fetch");
    const events = await kv.get("site_events") || [];
    return c.json({ status: "success", events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return c.json({ status: "error", message: "Failed to fetch events" }, 500);
  }
});

app.post("/make-server-3336005e/admin/events", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin event creation");
    const eventData = await c.req.json();
    const events = await kv.get("site_events") || [];
    
    const newEvent = {
      id: Date.now(),
      ...eventData,
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    await kv.set("site_events", events);
    
    return c.json({ status: "success", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    return c.json({ status: "error", message: "Failed to create event" }, 500);
  }
});

app.put("/make-server-3336005e/admin/events/:id", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin event update");
    const eventId = parseInt(c.req.param("id"));
    const updates = await c.req.json();
    
    const events = await kv.get("site_events") || [];
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return c.json({ status: "error", message: "Event not found" }, 404);
    }
    
    events[eventIndex] = { ...events[eventIndex], ...updates, updatedAt: new Date().toISOString() };
    await kv.set("site_events", events);
    
    return c.json({ status: "success", event: events[eventIndex] });
  } catch (error) {
    console.error("Error updating event:", error);
    return c.json({ status: "error", message: "Failed to update event" }, 500);
  }
});

app.delete("/make-server-3336005e/admin/events/:id", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin event deletion");
    const eventId = parseInt(c.req.param("id"));
    const events = await kv.get("site_events") || [];
    
    const filteredEvents = events.filter(e => e.id !== eventId);
    await kv.set("site_events", filteredEvents);
    
    return c.json({ status: "success", message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return c.json({ status: "error", message: "Failed to delete event" }, 500);
  }
});

// Treatments CRUD - PROTECTED
app.get("/make-server-3336005e/admin/treatments", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin treatments fetch");
    const treatments = await kv.get("site_treatments") || [];
    return c.json({ status: "success", treatments });
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return c.json({ status: "error", message: "Failed to fetch treatments" }, 500);
  }
});

app.post("/make-server-3336005e/admin/treatments", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin treatment creation");
    const treatmentData = await c.req.json();
    const treatments = await kv.get("site_treatments") || [];
    
    const newTreatment = {
      id: Date.now(),
      ...treatmentData,
      createdAt: new Date().toISOString()
    };
    
    treatments.push(newTreatment);
    await kv.set("site_treatments", treatments);
    
    return c.json({ status: "success", treatment: newTreatment });
  } catch (error) {
    console.error("Error creating treatment:", error);
    return c.json({ status: "error", message: "Failed to create treatment" }, 500);
  }
});

app.put("/make-server-3336005e/admin/treatments/:id", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin treatment update");
    const treatmentId = parseInt(c.req.param("id"));
    const updates = await c.req.json();
    
    const treatments = await kv.get("site_treatments") || [];
    const treatmentIndex = treatments.findIndex(t => t.id === treatmentId);
    
    if (treatmentIndex === -1) {
      return c.json({ status: "error", message: "Treatment not found" }, 404);
    }
    
    treatments[treatmentIndex] = { ...treatments[treatmentIndex], ...updates, updatedAt: new Date().toISOString() };
    await kv.set("site_treatments", treatments);
    
    return c.json({ status: "success", treatment: treatments[treatmentIndex] });
  } catch (error) {
    console.error("Error updating treatment:", error);
    return c.json({ status: "error", message: "Failed to update treatment" }, 500);
  }
});

app.delete("/make-server-3336005e/admin/treatments/:id", adminAuth, async (c) => {
  try {
    console.log("🔐 Admin treatment deletion");
    const treatmentId = parseInt(c.req.param("id"));
    const treatments = await kv.get("site_treatments") || [];
    
    const filteredTreatments = treatments.filter(t => t.id !== treatmentId);
    await kv.set("site_treatments", filteredTreatments);
    
    return c.json({ status: "success", message: "Treatment deleted" });
  } catch (error) {
    console.error("Error deleting treatment:", error);
    return c.json({ status: "error", message: "Failed to delete treatment" }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);