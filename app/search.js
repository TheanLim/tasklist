const search = (searchQuery, tasks) => {
    let lowerCaseQuery = searchQuery.toLowerCase();

    // Extract include tags (e.g., [tag]) and exclude tags (e.g., -[tag])
    let includeTags = (lowerCaseQuery.match(/\[([^\]]+)\]/g) || []).map(tag => tag.slice(1, -1));
    let excludeTags = (lowerCaseQuery.match(/\-\[([^\]]+)\]/g) || []).map(tag => tag.slice(2, -1));

    // Remove exclude tags from includeTags list if they exist there
    includeTags = includeTags.filter(tag => !excludeTags.includes(tag));

    // Extract keywords (outside brackets)
    let searchKeywords = lowerCaseQuery.replace(/\[([^\]]+)\]/g, " ").replace(/\-\[([^\]]+)\]/g, " ");

    // Separate exact phrases (enclosed in quotes) and normal keywords
    let exactKeywords = (searchKeywords.match(/"([^"]+)"/g) || []).map(keyword => keyword.slice(1, -1));
    let normalKeywords = searchKeywords.replace(/"([^"]+)"/g, "").match(/\b\w+\b/g) || [];

    // Combine all keywords and retain structure for ranking
    let allKeywords = [...exactKeywords, ...normalKeywords];

    // Initialize arrays for AND matches and OR matches with ranking
    let andMatches = [];
    let orMatches = [];

    // Filter tasks
    tasks.forEach(task => {
        // Convert task fields to lowercase for case-insensitive search
        let taskTitle = task.title?.toLowerCase() || ""; // Optional chaining for task title
        let taskDetails = task.details?.toLowerCase() || ""; // Optional chaining for task details
        let taskTags = task.tags?.map(tag => tag.toLowerCase()) || []; // Optional chaining for task tags

        // Count the number of exact keyword matches (whole words only)
        let exactMatches = exactKeywords.reduce((count, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i'); // Word boundary regex for exact match
            return count + (regex.test(taskTitle) || regex.test(taskDetails) ? 1 : 0);
        }, 0);

        // Count the number of normal keyword matches in title and details
        let normalMatches = normalKeywords.reduce((count, keyword) => {
            return count + (taskTitle.includes(keyword) || taskDetails.includes(keyword) ? 1 : 0);
        }, 0);

        // Count the number of tag matches in taskTags
        let tagMatches = includeTags.reduce((count, tag) => {
            return count + (taskTags.includes(tag) ? 1 : 0);
        }, 0);

        // Check if task does NOT include any of the excludeTags
        let excludeTagMatch = excludeTags.every(tag => !taskTags.includes(tag));

        // Only process the task if it passes the exclude tag check
        if (excludeTagMatch) {
            let totalMatches = exactMatches + normalMatches + tagMatches;

            // Only add tasks that have at least one match
            if (totalMatches > 0) {
                // AND logic: Check if all keywords and tags match
                let allKeywordsMatch = allKeywords.every(keyword =>
                (exactKeywords.includes(keyword) ?
                    (new RegExp(`\\b${keyword}\\b`, 'i').test(taskTitle) || new RegExp(`\\b${keyword}\\b`, 'i').test(taskDetails)) :
                    taskTitle.includes(keyword) || taskDetails.includes(keyword)
                )
                );
                let allTagsMatch = includeTags.every(tag => taskTags.includes(tag));

                // If all keywords and tags match (AND match)
                if (allKeywordsMatch && allTagsMatch) {
                    andMatches.push({ task, totalMatches });
                }
                // Check if at least some keywords or tags match (OR match)
                else if (exactMatches > 0 || normalMatches > 0 || tagMatches > 0) {
                    orMatches.push({ task, totalMatches });
                }
            }
        }
    });

    // Sort AND matches by the total number of matches in descending order
    andMatches.sort((a, b) => b.totalMatches - a.totalMatches);

    // Sort OR matches by the total number of matches in descending order
    orMatches.sort((a, b) => b.totalMatches - a.totalMatches);

    // Combine results: AND matches first, then OR matches
    tasks = [...andMatches.map(item => item.task), ...orMatches.map(item => item.task)];

    // If no matches, return an empty array
    if (tasks.length === 0) {
        tasks = [];
    }
    return tasks;
}

export default search;
