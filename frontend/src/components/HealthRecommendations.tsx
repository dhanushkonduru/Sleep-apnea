'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Heart, 
  Moon, 
  Activity, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Users,
  BookOpen
} from 'lucide-react';

interface HealthRecommendationsProps {
  severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
  primaryCondition: string;
  apneaPercentage: number;
  comprehensiveSuggestions: string[];
}

export default function HealthRecommendations({
  severity,
  primaryCondition,
  apneaPercentage,
  comprehensiveSuggestions
}: HealthRecommendationsProps) {

  const getSeverityRecommendations = (severity: string) => {
    switch (severity) {
      case 'Severe':
        return {
          title: "🚨 Immediate Medical Attention Required",
          color: "from-red-500 to-pink-600",
          icon: AlertTriangle,
          recommendations: [
            "🏥 Schedule an urgent appointment with a sleep specialist or pulmonologist",
            "📞 Consider visiting an emergency room if experiencing severe breathing difficulties",
            "🛏️ Sleep in a semi-upright position to help with breathing",
            "📱 Keep a sleep diary to track symptoms and share with your doctor",
            "🚫 Avoid alcohol and sedatives that can worsen sleep apnea",
            "⚖️ Consider weight management if overweight (major risk factor)",
            "🩺 Request a comprehensive sleep study (polysomnography)"
          ]
        };
      case 'Moderate':
        return {
          title: "⚠️ Medical Consultation Recommended",
          color: "from-orange-500 to-red-500",
          icon: Stethoscope,
          recommendations: [
            "🏥 Schedule an appointment with your primary care physician",
            "🩺 Request a referral to a sleep specialist",
            "📊 Monitor your symptoms and keep a sleep diary",
            "🛏️ Try sleeping on your side instead of your back",
            "⚖️ Maintain a healthy weight and regular exercise",
            "🚫 Avoid alcohol and smoking, especially before bedtime",
            "🌙 Establish a consistent sleep schedule",
            "💊 Discuss CPAP therapy options with your doctor"
          ]
        };
      case 'Mild':
        return {
          title: "📈 Lifestyle Modifications Suggested",
          color: "from-yellow-500 to-orange-500",
          icon: Heart,
          recommendations: [
            "🏥 Consider discussing with your healthcare provider",
            "🛏️ Sleep on your side to reduce airway obstruction",
            "⚖️ Maintain a healthy weight through diet and exercise",
            "🌙 Establish good sleep hygiene practices",
            "🚫 Avoid alcohol and sedatives before bed",
            "💧 Stay hydrated throughout the day",
            "🧘 Practice relaxation techniques before bedtime",
            "📱 Monitor your sleep patterns with a sleep tracking app"
          ]
        };
      default:
        return {
          title: "✅ Continue Healthy Sleep Habits",
          color: "from-green-500 to-blue-500",
          icon: CheckCircle,
          recommendations: [
            "🛏️ Maintain your current healthy sleep routine",
            "⚖️ Continue maintaining a healthy weight",
            "🌙 Keep consistent sleep and wake times",
            "💧 Stay well-hydrated",
            "🧘 Continue stress management practices",
            "📊 Regular monitoring is still recommended",
            "🏥 Annual check-ups with your healthcare provider",
            "📱 Consider periodic sleep assessments"
          ]
        };
    }
  };

  const getConditionSpecificAdvice = (condition: string) => {
    if (condition.includes('Wheezing') || condition.includes('Asthma')) {
      return {
        title: "🫁 Asthma/Wheezing Management",
        advice: [
          "💨 Use prescribed inhalers as directed by your doctor",
          "🌬️ Avoid triggers like allergens, smoke, and cold air",
          "🏥 Keep emergency medications readily available",
          "📱 Monitor peak flow readings regularly",
          "🏃‍♂️ Engage in asthma-friendly exercises",
          "🏠 Maintain a clean, allergen-free bedroom environment"
        ]
      };
    }
    if (condition.includes('Distress')) {
      return {
        title: "🚨 Respiratory Distress Management",
        advice: [
          "🏥 Seek immediate medical attention",
          "🫁 Practice breathing exercises as taught by your therapist",
          "💊 Take medications exactly as prescribed",
          "📊 Monitor oxygen saturation if you have a pulse oximeter",
          "🚫 Avoid strenuous activities until cleared by a doctor",
          "🏠 Ensure your living space is well-ventilated"
        ]
      };
    }
    return null;
  };

  const severityData = getSeverityRecommendations(severity);
  const conditionAdvice = getConditionSpecificAdvice(primaryCondition);

  return (
    <div className="space-y-8">
      {/* Main Severity-Based Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${severityData.color} rounded-xl p-8 text-white shadow-lg`}
      >
        <div className="flex items-center space-x-4 mb-6">
          <severityData.icon className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{severityData.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {severityData.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-white bg-opacity-20 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium">{recommendation}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Condition-Specific Advice */}
      {conditionAdvice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-6 h-6 mr-3 text-blue-600" />
            {conditionAdvice.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conditionAdvice.advice.map((advice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
              >
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800">{advice}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* General Sleep Health Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Moon className="w-6 h-6 mr-3 text-purple-600" />
          General Sleep Health Guidelines
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Sleep Schedule
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Go to bed and wake up at the same time daily</li>
              <li>• Aim for 7-9 hours of sleep per night</li>
              <li>• Avoid naps longer than 30 minutes</li>
              <li>• Create a relaxing bedtime routine</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Lifestyle Factors
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Maintain a healthy weight</li>
              <li>• Exercise regularly (but not close to bedtime)</li>
              <li>• Avoid alcohol and caffeine before bed</li>
              <li>• Don't smoke or use tobacco products</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Sleep Environment
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Keep bedroom cool, dark, and quiet</li>
              <li>• Use comfortable bedding and pillows</li>
              <li>• Remove electronic devices from bedroom</li>
              <li>• Consider using a humidifier if needed</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* When to Seek Medical Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
          When to Seek Immediate Medical Help
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-red-800 mb-3">🚨 Emergency Symptoms</h4>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• Severe difficulty breathing or shortness of breath</li>
              <li>• Chest pain or pressure</li>
              <li>• Blue lips or fingernails</li>
              <li>• Confusion or loss of consciousness</li>
              <li>• Severe wheezing that doesn't respond to medication</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-orange-800 mb-3">⚠️ Schedule an Appointment</h4>
            <ul className="space-y-2 text-sm text-orange-700">
              <li>• Loud, frequent snoring</li>
              <li>• Gasping or choking during sleep</li>
              <li>• Excessive daytime sleepiness</li>
              <li>• Morning headaches</li>
              <li>• Difficulty concentrating or memory problems</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Treatment Options Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
          Common Treatment Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">🫁 CPAP Therapy</h4>
            <p className="text-sm text-blue-700 mb-3">
              Continuous Positive Airway Pressure - the gold standard treatment for sleep apnea.
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Worn during sleep</li>
              <li>• Keeps airway open</li>
              <li>• Highly effective</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">🦷 Oral Appliances</h4>
            <p className="text-sm text-green-700 mb-3">
              Custom-fitted devices that reposition the jaw to keep airway open.
            </p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Less invasive than CPAP</li>
              <li>• Good for mild to moderate cases</li>
              <li>• Requires dental fitting</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">🏥 Surgical Options</h4>
            <p className="text-sm text-purple-700 mb-3">
              Various surgical procedures to address anatomical causes of sleep apnea.
            </p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• Uvulopalatopharyngoplasty (UPPP)</li>
              <li>• Maxillomandibular advancement</li>
              <li>• Inspire therapy (implant)</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Important Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-100 rounded-xl p-6 border-l-4 border-gray-400"
      >
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Important Medical Disclaimer</h4>
            <p className="text-sm text-gray-700">
              This analysis is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
              If you think you may have a medical emergency, call your doctor or emergency services immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
