import React, { useState, useEffect } from 'react';
import { User, Lock, Check, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

function App() {
  const servicesData = [
    { id: 's1', name: 'Брови', duration: 60, price: '1500₽', category: 'Брови' },
    { id: 's2', name: 'Маникюр', duration: 90, price: '1200₽', category: 'Ногти' },
    { id: 's3', name: 'Чистка лица', duration: 75, price: '2500₽', category: 'Косметология' },
    { id: 's4', name: 'Массаж', duration: 45, price: '1800₽', category: 'Массаж' },
    { id: 's5', name: 'Окрашивание', duration: 120, price: '3000₽', category: 'Волосы' }
  ];

  const mastersData = [
    { id: 'm1', name: 'Анна', photo: null, categories: ['Брови', 'Косметология'] },
    { id: 'm2', name: 'Мария', photo: null, categories: ['Ногти'] },
    { id: 'm3', name: 'Ольга', photo: null, categories: ['Косметология', 'Брови'] },
    { id: 'm4', name: 'Евгений', photo: null, categories: ['Массаж'] },
    { id: 'm5', name: 'Светлана', photo: null, categories: ['Волосы'] }
  ];

  const busySlots = {
    'm1': ['2025-05-12', '2025-05-15'],
    'm2': ['2025-05-13', '2025-05-16'],
    'm3': ['2025-05-14', '2025-05-17'],
  };

  const busyTimes = {
    'm1_2025-05-12': ['10:00', '13:00', '16:00'],
    'm2_2025-05-14': ['11:00', '14:00', '17:00'],
    'm3_2025-05-13': ['09:00', '12:00', '15:00'],
  };

  const [selectedService, setSelectedService] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2025, 4, 12));
  const [currentScreen, setCurrentScreen] = useState('service');

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // Автоматический переход к выбору мастера
    setCurrentScreen('master');
  };

  const handleMasterSelect = (master) => {
    setSelectedMaster(master);
    // Автоматический переход к выбору даты и времени
    setCurrentScreen('datetime');
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    // Сразу переходим к экрану чата после выбора времени
    setCurrentScreen('chat'); 
  };

  const getAvailableMasters = () => {
    if (!selectedService) return [];
    return mastersData.filter(m => m.categories.includes(selectedService.category));
  };

  const isDayAvailable = (date, masterId) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return !busySlots[masterId]?.includes(dateStr);
  };

  const getAvailableTimes = () => {
    if (!selectedMaster || !selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const key = `${selectedMaster.id}_${dateStr}`;
    const busyTimeSlots = busyTimes[key] || [];
    
    const allTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    return allTimes.map(time => ({
      time,
      available: !busyTimeSlots.includes(time)
    }));
  };

  // const handleBooking = () => {
  //   // alert('Отлично! За 3 часа до визита я пришлю вам напоминание.');
  //   setCurrentScreen('chat'); // Новый экран для чата - теперь это делается в handleTimeSelect
  // };

  const navigateToScreen = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-3 sm:p-6">
        {/* Шапка с навигацией */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm sm:text-base">
              Ai
            </div>
            <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold">Алина</span>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {/* Улучшенная навигация по предыдущим шагам */}
            {selectedService && currentScreen !== 'service' && (
              <button 
                onClick={() => navigateToScreen('service')}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg bg-blue-50 text-blue-500 flex items-center"
              >
                <ArrowLeft size={12} className="mr-1" />
                Услуги
              </button>
            )}
            {selectedMaster && (currentScreen === 'datetime' || currentScreen === 'confirmation') && (
              <button 
                onClick={() => navigateToScreen('master')}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg bg-blue-50 text-blue-500 flex items-center"
              >
                <ArrowLeft size={12} className="mr-1" />
                Мастера
              </button>
            )}
            {selectedDate && selectedTime && currentScreen === 'confirmation' && (
              <button 
                onClick={() => navigateToScreen('datetime')}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg bg-blue-50 text-blue-500 flex items-center"
              >
                <ArrowLeft size={12} className="mr-1" />
                Дата
              </button>
            )}
          </div>
        </div>

        {/* Выбор услуги */}
        {currentScreen === 'service' && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className="text-base sm:text-lg font-semibold">
                {selectedService ? selectedService.name : 'Выберите услугу'}
              </h2>
              {selectedService && (
                <span className="text-xs sm:text-sm text-gray-500">{selectedService.price}</span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-3">
              {servicesData.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-2 sm:p-3 rounded-lg text-left transition-all ${
                    selectedService?.id === service.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm sm:text-base font-medium">{service.name}</div>
                  <div className="text-xs sm:text-sm opacity-80">{service.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Выбор мастера */}
        {currentScreen === 'master' && selectedService && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className="text-base sm:text-lg font-semibold">
                {selectedMaster ? selectedMaster.name : 'Выберите мастера'}
              </h2>
            </div>

            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 mt-2 sm:mt-3">
              {getAvailableMasters().map(master => (
                <button
                  key={master.id}
                  onClick={() => handleMasterSelect(master)}
                  className={`flex flex-col items-center min-w-[70px] sm:min-w-[80px] p-2 rounded-lg transition-all ${
                    selectedMaster?.id === master.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                    selectedMaster?.id === master.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}>
                    {master.name[0]}
                  </div>
                  <span className="text-xs sm:text-sm">{master.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Выбор даты и времени */}
        {currentScreen === 'datetime' && selectedMaster && (
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className="text-base sm:text-lg font-semibold">
                {selectedDate 
                  ? `${format(selectedDate, 'd MMMM', { locale: ru })} ${selectedTime || ''}`
                  : 'Выберите дату и время'
                }
              </h2>
            </div>

            {/* Календарь */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <button onClick={() => setCurrentWeekStart(d => addDays(d, -7))}>
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                </button>
                <span className="text-sm sm:text-base font-medium">
                  {format(currentWeekStart, 'MMMM yyyy', { locale: ru })}
                </span>
                <button onClick={() => setCurrentWeekStart(d => addDays(d, 7))}>
                  <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = addDays(currentWeekStart, i);
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const key = `${selectedMaster.id}_${dateStr}`;
                  const hasBusySlots = busyTimes[key] && busyTimes[key].length > 0;
                  const isAvailable = i % 2 === 0; // Имитация того, что половина дат недоступна
                  
                  return (
                    <button
                      key={i}
                      onClick={() => isAvailable && handleDateSelect(date)}
                      className={`p-1 sm:p-2 rounded-lg text-center relative ${
                        selectedDate && isSameDay(date, selectedDate)
                          ? 'bg-blue-500 text-white'
                          : isAvailable
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-gray-200'
                      }`}
                      disabled={!isAvailable}
                    >
                      <div className="text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                        {format(date, 'EEE', { locale: ru })}
                      </div>
                      <div className="text-sm sm:text-base font-medium">
                        {format(date, 'd')}
                      </div>
                      {/* Отображение занятого времени в календаре */}
                      {!isAvailable && (
                        <Lock size={8} className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-gray-500" />
                      )}
                      {isAvailable && hasBusySlots && (
                        <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex items-center">
                          <Lock size={8} className="text-gray-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Временные слоты */}
            {selectedDate && (
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-2">
                {getAvailableTimes().map(({ time, available }, index) => {
                  // Имитация того, что половина времени недоступна
                  const isReallyAvailable = index % 2 === 0 ? available : false;
                  return (
                    <button
                      key={time}
                      onClick={() => isReallyAvailable && handleTimeSelect(time)}
                      disabled={!isReallyAvailable}
                      className={`py-2 sm:py-2 px-2 sm:px-3 rounded-lg text-center relative text-xs sm:text-sm ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : isReallyAvailable
                          ? 'border border-blue-500 text-blue-500 hover:bg-blue-50'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {time}
                      {!isReallyAvailable && (
                        <Lock size={8} className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-gray-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Кнопка записи больше не нужна, так как выбор времени подтверждает запись */}

        {/* Экран чата с AI ассистентом */} 
        {currentScreen === 'chat' && selectedService && selectedMaster && selectedDate && selectedTime && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0">
                Ai
              </div>
              <div className="bg-white p-2 sm:p-3 rounded-lg shadow flex-grow">
                <p className="text-xs sm:text-sm text-gray-800 font-semibold mb-1 sm:mb-2">Ваша запись подтверждена!</p>
                <p className="text-xs sm:text-sm text-gray-700">
                  Уважаемый клиент, <br />
                  Вы записаны на услугу: <strong>{selectedService.name}</strong><br />
                  Мастер: <strong>{selectedMaster.name}</strong><br />
                  Дата: <strong>{format(selectedDate, 'd MMMM (EEE)', { locale: ru })}</strong><br />
                  Время: <strong>{selectedTime}</strong><br />
                  Адрес: <a href="https://maps.app.goo.gl/NDXhdTJvx7yjKVoa8" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Студия "Красота", ул. Примерная, 10</a>
                </p>
                <p className="text-xs sm:text-sm text-gray-700 mt-2 sm:mt-3">
                  ⚡Я напомню вам о записи за 12 и за 3 часа до встречи.
                </p>
                <div className="flex items-center mt-2 sm:mt-3 text-xs sm:text-sm text-blue-500">
                  <MessageCircle size={14} className="mr-1" />
                  <a href="https://t.me/la_gracee" target="_blank" rel="noopener noreferrer" className="hover:underline">t.me/la_gracee</a>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                window.open('https://t.me/la_gracee', '_blank');
              }}
              className="w-full mt-3 sm:mt-4 py-1.5 sm:py-2 px-3 sm:px-4 bg-blue-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <MessageCircle size={16} className="mr-2" />
              Связаться с ассистентом
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

// Второе сообщение от ИИ: Если что непонятно, спрашивайте! Я на связи в Telegram: t.me/la_gracee