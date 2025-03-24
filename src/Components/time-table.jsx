import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';

const TimeTable = () => {
  // API Configuration
  const API_KEY = "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";
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  // State Management
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [formData, setFormData] = useState({
    mainSubjects: [],
    extracurricular: [],
    studyPreference: 'morning',
    weekendPreference: 'light',
    travelTime: '30', // in minutes
    breakPreference: 'short', // short or long breaks
    extraActivities: [] // for additional activities
  });
  const [error, setError] = useState(null);

  // Predefined color schemes for different activities
  const activityColors = {
    study: '#e3f2fd',
    exercise: '#f1f8e9',
    extracurricular: '#fff3e0',
    break: '#f3e5f5',
    personal: '#e8eaf6'
  };

  // Templates for different schedule types
  const scheduleTemplates = {
    academic: {
      name: 'Academic Focus',
      description: 'Heavy focus on studies with balanced breaks'
    },
    balanced: {
      name: 'Balanced Schedule',
      description: 'Equal distribution of studies and activities'
    },
    exam: {
      name: 'Exam Preparation',
      description: 'Intensive study schedule for exam preparation'
    },
    custom: {
      name: 'Custom Schedule',
      description: 'Create your own schedule from scratch'
    }
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 7; // Starting from 7 AM to 6 PM to include commute
    return `${hour}:00 - ${hour + 1}:00`;
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (e) => {
    const subjects = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({
      ...prev,
      mainSubjects: subjects
    }));
  };

  const handleExtraActivities = (e) => {
    const activities = e.target.value.split(',').map(a => a.trim());
    setFormData(prev => ({
      ...prev,
      extraActivities: activities
    }));
  };

  const generateSchedule = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Create a detailed weekly schedule for college with these parameters:
        College Hours: 9:00 AM to 4:00 PM
        Travel Time: ${formData.travelTime} minutes
        Main Subjects: ${formData.mainSubjects.join(', ')}
        Extra Activities: ${formData.extraActivities.join(', ')}
        Break Preference: ${formData.breakPreference}
        Study Preference: ${formData.studyPreference}
        Weekend Preference: ${formData.weekendPreference}

        Return ONLY a JSON object with this EXACT format:
        {
          "schedule": {
            "Monday": [
              {"time": "7:00 - 8:00", "activity": "Travel to College", "type": "travel"},
              {"time": "8:00 - 9:00", "activity": "Morning Preparation", "type": "study"}
            ],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
          }
        }`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Timetable Generator'
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are a scheduling assistant. Respond only with valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // For debugging

      const responseText = data.choices[0].message.content;
      console.log("Response Text:", responseText); // For debugging

      let scheduleData;
      try {
        scheduleData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        throw new Error('Failed to parse schedule data');
      }

      if (!scheduleData.schedule) {
        throw new Error('Invalid schedule data structure');
      }

      setSchedule(scheduleData.schedule);
      console.log("Processed Schedule:", scheduleData.schedule); // For debugging

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setSchedule({});
    } finally {
      setIsLoading(false);
    }
  };

  // Add this helper function to organize schedule data
  const organizeScheduleData = (scheduleData) => {
    console.log('Organizing schedule data:', scheduleData); // Debug log
    
    const organized = {};
    
    // Create empty schedule structure
    days.forEach(day => {
      organized[day] = {};
      timeSlots.forEach(slot => {
        organized[day][slot] = {
          activity: "Free Time",
          type: "personal"
        };
      });
    });

    // Fill in scheduled activities
    if (scheduleData?.schedule) {
      Object.entries(scheduleData.schedule).forEach(([day, activities]) => {
        if (Array.isArray(activities)) {
          activities.forEach(item => {
            const timeSlot = item.time;
            if (timeSlots.includes(timeSlot)) {
              organized[day][timeSlot] = {
                activity: item.activity,
                type: item.type.toLowerCase()
              };
            }
          });
        }
      });
    }

    return organized;
  };

  // Add this helper function to determine activity type
  const getActivityType = (activity) => {
    activity = activity.toLowerCase();
    if (activity.includes('study') || activity.includes('class')) return 'study';
    if (activity.includes('break') || activity.includes('lunch')) return 'break';
    if (activity.includes('travel') || activity.includes('commute')) return 'travel';
    if (activity.includes('sport') || activity.includes('club')) return 'extracurricular';
    if (activity.includes('exercise')) return 'exercise';
    return 'personal';
  };

  // Add this animation configuration inside the component
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const cardTransition = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="timetable-container"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <div className="timetable-content">
        <motion.h1 
          className="timetable-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Create Your Perfect Schedule
        </motion.h1>
        
        {/* Template Selection with enhanced animation */}
        <motion.div 
          className="template-selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Choose a Template</h2>
          <div className="template-grid">
            {Object.entries(scheduleTemplates).map(([key, template], index) => (
              <motion.div
                key={key}
                className={`template-card ${selectedTemplate === key ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(key)}
                variants={cardTransition}
                initial="initial"
                animate="animate"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form with smooth animations */}
        <motion.div 
          className="schedule-form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="form-group">
            <label>Main Subjects (comma-separated)</label>
            <input
              type="text"
              name="subjects"
              onChange={handleSubjectChange}
              placeholder="Math, Science, History..."
            />
          </div>

          <div className="form-group">
            <label>Extra-curricular Activities (comma-separated)</label>
            <input
              type="text"
              name="extraActivities"
              onChange={handleExtraActivities}
              placeholder="Sports, Music, Club Activities..."
            />
          </div>

          <div className="form-group">
            <label>Travel Time (minutes)</label>
            <select
              name="travelTime"
              value={formData.travelTime}
              onChange={handleInputChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div className="form-group">
            <label>Break Preference</label>
            <select
              name="breakPreference"
              value={formData.breakPreference}
              onChange={handleInputChange}
            >
              <option value="short">Short Frequent Breaks</option>
              <option value="long">Longer Less Frequent Breaks</option>
            </select>
          </div>

          <div className="form-group">
            <label>Study Preference</label>
            <select
              name="studyPreference"
              value={formData.studyPreference}
              onChange={handleInputChange}
            >
              <option value="morning">Morning Person</option>
              <option value="afternoon">Afternoon Person</option>
              <option value="evening">Evening Person</option>
            </select>
          </div>

          <div className="form-group">
            <label>Weekend Study Intensity</label>
            <select
              name="weekendPreference"
              value={formData.weekendPreference}
              onChange={handleInputChange}
            >
              <option value="light">Light (Few Hours)</option>
              <option value="moderate">Moderate (Half Day)</option>
              <option value="intensive">Intensive (Full Day)</option>
            </select>
          </div>

          <button
            className="generate-button"
            onClick={generateSchedule}
            disabled={isLoading}
          >
            {isLoading ? 'Generating Schedule...' : 'Generate Schedule'}
          </button>
        </motion.div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p>Error: {error}</p>
            <p>Please try again with different preferences or check your connection.</p>
          </motion.div>
        )}

        {/* Schedule Display */}
        <div className="timetable-grid">
          {/* Time slots column */}
          <div className="time-slots">
            <div className="header-cell">Time</div>
            {timeSlots.map(slot => (
              <div key={slot} className="time-cell">{slot}</div>
            ))}
          </div>

          {/* Days columns */}
          {days.map(day => {
            const daySchedule = organizeScheduleData(schedule)[day] || {};
            return (
              <div key={day} className="day-column">
                <div className="header-cell">{day}</div>
                <div className="day-slots">
                  {timeSlots.map((slot, index) => {
                    const activity = daySchedule[slot] || { activity: "Free Time", type: "personal" };
                    const activityType = activity.type.toLowerCase();
                    
                    return (
                      <motion.div
                        key={`${day}-${slot}`}
                        className="activity-cell"
                        data-type={activityType}
                        style={{
                          backgroundColor: activityColors[activityType] || activityColors.personal,
                          borderLeft: `4px solid ${
                            activityType === 'study' ? '#1976d2' :
                            activityType === 'break' ? '#7b1fa2' :
                            activityType === 'travel' ? '#f57c00' :
                            activityType === 'extracurricular' ? '#388e3c' :
                            '#9e9e9e'
                          }`
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <span className="activity-text">
                          {activity.activity}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations and Tips */}
        {schedule.recommendations && (
          <div className="recommendations">
            <h3>Recommendations</h3>
            <ul>
              {schedule.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {schedule.tips && (
          <div className="tips">
            <h3>Tips for Success</h3>
            <ul>
              {schedule.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TimeTable;
