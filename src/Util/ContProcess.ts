interface ContProcess {
	/**
	 * Returns the time that the next event will occur in this process.
	 * Assumes no other processes have an event before that time.
	 * @return The time of the next event.
	 */
    peekNextEventTime(): number;

	/**
	 * Advances this process to the given time, without resolving
	 * any events at that time.  No events should occur before
	 * this time either.
	 * @param time Time to advance the process to.  This must be
	 * at most {@link #peekNextEventTime()}.
	 */
    stepToTime(time: number);

	/**
	 * Resolve an event that occurs at the current time.
	 */
    resolveEvent();
}